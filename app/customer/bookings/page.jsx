'use client';

import React, { useState, useEffect } from 'react';
import { Search, Info, Compass, UserCircle, Bell, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import FilterSidebar from '@/app/components/cafes/FilterSidebar';
import FilterDrawer from '@/app/components/cafes/FilterDrawer';
import { bookingService } from '@/services/booking.service';
import BookingCard from '@/app/components/bookings/BookingCard';
import BookingTabs from '@/app/components/bookings/BookingTabs';
import EmptyBookings from '@/app/components/bookings/EmptyBookings';
import LoadingBookings from '@/app/components/bookings/LoadingBookings';
import { motion } from 'framer-motion';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn('User does not have customer role permission to view personal bookings.');
      } else {
        console.error('Failed to fetch bookings:', error);
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    let filtered = [...bookings];

    // Status Filter
    if (activeTab === 'UPCOMING') {
      filtered = filtered.filter(b => b.booking_status === 'PENDING' || b.booking_status === 'CONFIRMED');
    } else if (activeTab === 'COMPLETED') {
      filtered = filtered.filter(b => b.booking_status === 'COMPLETED');
    } else if (activeTab === 'CANCELLED') {
      filtered = filtered.filter(b => b.booking_status === 'CANCELLED' || b.booking_status === 'REJECTED');
    }

    // Search Filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.booking_number?.toLowerCase().includes(lowerQuery) ||
        b.cafes?.name?.toLowerCase().includes(lowerQuery) ||
        b.packages?.name?.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort by Newest
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return filtered;
  };

  const filteredBookings = getFilteredBookings();

  const bookingStats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.booking_status === 'PENDING' || b.booking_status === 'CONFIRMED').length,
    completed: bookings.filter(b => b.booking_status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.booking_status === 'CANCELLED' || b.booking_status === 'REJECTED').length,
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-12">
      {/* Sticky Top Navbar */}
      <CustomerNavbar 
        showSearch={true} 
        showViewToggles={false} 
      />

      {/* Mobile Filter & Aside Nav Drawer */}
      <FilterDrawer 
        isOpen={isMobileFilterOpen} 
        onClose={() => setIsMobileFilterOpen(false)} 
        mode="bookings" 
        bookingStats={bookingStats} 
      />

      {/* Main Container Wrapper */}
      <main className="container mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-full overflow-x-hidden flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        
        {/* Left Aside Navigation Panel (Desktop 1024px+) */}
        <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-[7.5rem]">
          <FilterSidebar mode="bookings" bookingStats={bookingStats} />
        </aside>

        {/* Main Dashboard Body */}
        <div className="flex-1 min-w-0 w-full">
          
          {/* Header Row: Title & Real-time Search Input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight flex items-center gap-2">
                <span>My Bookings</span>
                <span className="text-xs font-black bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60 px-2.5 py-1 rounded-full shadow-2xs">
                  {filteredBookings.length} Total
                </span>
              </h1>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Manage and track all your cafe and event reservations
              </p>
            </div>
            
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by cafe or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200/80 rounded-2xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#DDB892]/30 focus:border-[#6F4E37] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Filter Status Tabs */}
          <div className="mb-6">
            <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Bookings Grid Section */}
          <div>
            {loading ? (
              <LoadingBookings />
            ) : filteredBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <EmptyBookings />
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
