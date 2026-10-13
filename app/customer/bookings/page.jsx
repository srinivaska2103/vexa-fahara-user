'use client';

import React, { useState, useEffect } from 'react';
import { Search, Info, Compass, UserCircle, Bell, Sparkles, ArrowLeft, X, Check, Calendar, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import FilterSidebar from '@/app/components/cafes/FilterSidebar';
import FilterDrawer from '@/app/components/cafes/FilterDrawer';
import { bookingService } from '@/services/booking.service';
import BookingCard from '@/app/components/bookings/BookingCard';
import MobileBookingCard from '@/app/components/bookings/MobileBookingCard';
import BookingTabs from '@/app/components/bookings/BookingTabs';
import EmptyBookings from '@/app/components/bookings/EmptyBookings';
import LoadingBookings from '@/app/components/bookings/LoadingBookings';
import { motion, AnimatePresence } from 'framer-motion';

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
      if (res && res.success && Array.isArray(res.data)) {
        setBookings(res.data);
      } else if (Array.isArray(res)) {
        setBookings(res);
      } else {
        setBookings([]);
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

  const [mobileSort, setMobileSort] = useState('newest');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Status categories for mobile chips
  const mobileStatusChips = [
    { id: 'ALL', label: 'All Bookings', count: bookingStats.total },
    { id: 'UPCOMING', label: 'Upcoming', count: bookingStats.upcoming },
    { id: 'COMPLETED', label: 'Completed', count: bookingStats.completed },
    { id: 'CANCELLED', label: 'Cancelled', count: bookingStats.cancelled },
  ];

  // Mobile filtered and sorted items
  const mobileFilteredBookings = React.useMemo(() => {
    let result = [...filteredBookings];

    switch (mobileSort) {
      case 'oldest':
        result.sort((a, b) => new Date(a.booking_date || a.created_at) - new Date(b.booking_date || b.created_at));
        break;
      case 'date_asc':
        result.sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date));
        break;
      case 'price_high':
        result.sort((a, b) => Number(b.total || 0) - Number(a.total || 0));
        break;
      case 'price_low':
        result.sort((a, b) => Number(a.total || 0) - Number(b.total || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at || b.booking_date) - new Date(a.created_at || a.booking_date));
        break;
    }

    return result;
  }, [filteredBookings, mobileSort]);

  if (loading) {
    return <LoadingBookings />;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased text-[#2C1810] flex flex-col selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-12">
      
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE VIEW REDESIGN (Exact Match to Favourites UI)
          Visible only on screens < 768px (md:hidden)
         ───────────────────────────────────────────────────────────── */}
      <div className="block md:hidden w-full select-none pb-20">
        
        {/* Sticky Top Header, Search & Filter Chips Container */}
        <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md pt-4 pb-2 px-4 border-b border-[#E8DED5]/60 shadow-[0_4px_16px_rgba(44,24,16,0.03)]">
          {/* Header Row: Back button, Calendar Circle Icon, Title & Subtitle */}
          <div className="flex items-center gap-3.5 mb-3.5">
            <Link
              href="/customer/cafe"
              className="w-10 h-10 rounded-full bg-white border border-[#E8DED5] flex items-center justify-center text-[#2C1810] shadow-2xs active:scale-90 transition-transform cursor-pointer"
              aria-label="Back to cafes"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="w-10 h-10 rounded-full bg-[#F5EBE0] border border-[#DDB892]/50 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Calendar size={18} className="text-[#6F4E37]" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-black text-[#2C1810] tracking-tight leading-tight flex items-center gap-2">
                <span>My Bookings</span>
                {filteredBookings.length > 0 && (
                  <span className="text-[10px] font-black bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60 px-2 py-0.5 rounded-full">
                    {filteredBookings.length}
                  </span>
                )}
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Manage all your cafe reservations
              </p>
            </div>
          </div>

          {/* Search & Sort/Filter Trigger Row */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by cafe or booking ID..."
                className="w-full pl-9 pr-9 py-2.5 rounded-full bg-white border border-[#E8DED5] text-xs font-semibold text-[#2C1810] placeholder:text-stone-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#DDB892] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsFilterSheetOpen(true)}
              className="w-11 h-11 rounded-2xl bg-white border border-[#E8DED5] flex items-center justify-center text-[#2C1810] shadow-2xs active:scale-95 transition-transform cursor-pointer flex-shrink-0"
              aria-label="Sort & Filter"
            >
              <SlidersHorizontal size={17} className="text-[#6F4E37]" />
            </button>
          </div>

          {/* Horizontal Status Chips (All, Upcoming, Completed, Cancelled) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {mobileStatusChips.map((chip) => {
              const isSelected = activeTab === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveTab(chip.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer shadow-2xs active:scale-95 ${
                    isSelected
                      ? 'bg-[#6F4E37] text-white border border-[#6F4E37] shadow-sm'
                      : 'bg-white text-stone-600 border border-[#E8DED5] hover:bg-stone-50'
                  }`}
                >
                  <span>{chip.label}</span>
                  {chip.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {chip.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Bookings List (Interactive Cards matching Favourites Style) */}
        <div className="px-4 space-y-3.5 mt-3">
          {mobileFilteredBookings.length > 0 ? (
            mobileFilteredBookings.map((booking) => (
              <MobileBookingCard
                key={booking.id}
                booking={booking}
                onDeleteSuccess={(deletedId) => {
                  setBookings((prev) => prev.filter((b) => b.id !== deletedId));
                }}
              />
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-[#E8DED5] text-center my-6 shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-[#FFF8F0] border border-[#DDB892]/40 flex items-center justify-center mx-auto mb-3 text-[#6F4E37]">
                <Calendar size={24} className="text-[#6F4E37]" />
              </div>
              <h3 className="text-base font-black text-[#2C1810] mb-1">
                {searchQuery ? "No matching bookings found" : "No bookings yet"}
              </h3>
              <p className="text-xs text-stone-500 mb-5 max-w-xs mx-auto">
                {searchQuery
                  ? "Try searching by a different cafe name or booking ID."
                  : "Reserve a cafe table or space to view your upcoming bookings here."}
              </p>
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  href="/customer/cafe"
                  className="inline-block px-6 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Explore Cafes
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile Bottom Sort & Filter Sheet */}
        <AnimatePresence>
          {isFilterSheetOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterSheetOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-[#FFF8F0] rounded-t-[28px] p-5 z-50 shadow-2xl border-t border-[#E8DED5]"
              >
                <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mb-4" />
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-[#2C1810]">Sort Bookings</h3>
                  <button
                    type="button"
                    onClick={() => setIsFilterSheetOpen(false)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-black text-stone-400 uppercase tracking-widest block mb-2">
                      Sort By
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'newest', label: 'Newest Added' },
                        { id: 'date_asc', label: 'Booking Date' },
                        { id: 'price_high', label: 'Highest Amount' },
                        { id: 'price_low', label: 'Lowest Amount' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setMobileSort(s.id);
                            setIsFilterSheetOpen(false);
                          }}
                          className={`py-2.5 px-3 rounded-2xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                            mobileSort === s.id
                              ? 'bg-[#6F4E37] text-white border-[#6F4E37]'
                              : 'bg-white text-stone-700 border-[#E8DED5]'
                          }`}
                        >
                          <span>{s.label}</span>
                          {mobileSort === s.id && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsFilterSheetOpen(false)}
                    className="w-full py-3 rounded-full bg-[#6F4E37] text-white font-bold text-xs uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DESKTOP VIEW (Screens >= 768px: Completely Untouched)
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block">
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
          
          {/* Left Aside Navigation Panel (Desktop 1024px+ Completely Fixed Non-Movable) */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 fixed top-[5.5rem] z-20">
            <FilterSidebar mode="bookings" bookingStats={bookingStats} isNonScrollable={true} />
          </aside>

          {/* Main Dashboard Body */}
          <div className="flex-1 min-w-0 w-full lg:ml-80 xl:ml-88">
            
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
              {filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredBookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      onDeleteSuccess={(deletedId) => {
                        setBookings(prev => prev.filter(b => b.id !== deletedId));
                      }}
                    />
                  ))}
                </div>
              ) : (
                <EmptyBookings />
              )}
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
