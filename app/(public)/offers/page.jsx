'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import {
  BadgePercent,
  Search,
  Sparkles,
  Store,
  Clock,
  ArrowRight,
  Filter,
  Calendar,
  Loader2,
  UtensilsCrossed
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function OffersDiscoveryPage() {
  const [selectedScope, setSelectedScope] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: offersData, isLoading } = useQuery({
    queryKey: ['public-offers'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/public/offers?limit=50');
      return res.data?.data || [];
    }
  });

  const offers = offersData || [];

  const filteredOffers = offers.filter((o) => {
    if (selectedScope !== 'ALL' && o.offer_type !== selectedScope) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = o.title.toLowerCase().includes(q);
      const matchCafe = (o.cafes?.name || '').toLowerCase().includes(q);
      const matchCity = (o.cafes?.city || '').toLowerCase().includes(q);
      return matchTitle || matchCafe || matchCity;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFF5F5] pb-24 font-sans">
      
      {/* Hero Banner */}
      <div className="bg-[#E50914] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-black uppercase tracking-wider border border-white/20">
            <BadgePercent className="w-4 h-4 text-amber-300" />
            <span>Grab2GO Deals &amp; Discounts</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Exclusive Dining Offers &amp; Discounts
          </h1>
          <p className="text-sm sm:text-base text-amber-100/90 max-w-2xl font-medium">
            Save on top dishes, artisanal beverages, and restaurant dining experiences across your city.
          </p>

          {/* Search Box inside Hero */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <Search className="w-5 h-5 text-[#757575] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search offers by dish, offer title, restaurant or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl text-xs sm:text-sm text-[#252525] placeholder-[#757575] font-bold shadow-lg focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Scope Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Deals' },
            { id: 'RESTAURANT', label: 'Restaurant-wide Deals' },
            { id: 'CATEGORY', label: 'Category Deals' },
            { id: 'ITEM', label: 'Dish Discounts' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedScope(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border ${
                selectedScope === tab.id
                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-md shadow-[#E50914]/20'
                  : 'bg-white text-[#252525] border-[#FEE2E2] hover:bg-[#FFF5F5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Offers Cards Grid */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-16 border border-[#FEE2E2] text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#E50914] mx-auto" />
            <p className="text-xs font-bold text-[#757575]">Loading active promotional offers...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 border border-[#FEE2E2] text-center space-y-3">
            <div className="w-14 h-14 bg-[#FFF5F5] rounded-full flex items-center justify-center mx-auto text-[#FF6B00]">
              <BadgePercent className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-[#252525]">No Deals Found</h3>
            <p className="text-xs text-[#757575] max-w-sm mx-auto">
              No promotional offers matched your search criteria right now. Check back soon for fresh deals!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const isPercentage = offer.discount_type === 'PERCENTAGE';
              const cafe = offer.cafes || {};

              return (
                <div
                  key={offer.id}
                  className="group bg-white border border-[#FEE2E2] hover:border-[#E50914]/40 rounded-3xl p-5 shadow-xs hover:shadow-xl hover:shadow-[#E50914]/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div className="space-y-3.5">
                    
                    {/* Top Row: Discount Value Pill & Scope */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#E50914] text-white text-xs font-black tracking-wider shadow-xs uppercase">
                        {isPercentage ? `${Number(offer.discount_value)}% OFF` : `₹${Number(offer.discount_value)} OFF`}
                      </span>
                      <span className="text-[10px] font-bold text-[#757575] bg-[#FFF5F5] px-2.5 py-1 rounded-lg border border-[#FEE2E2] uppercase">
                        {offer.offer_type === 'RESTAURANT' ? 'Entire Menu' : offer.offer_type === 'CATEGORY' ? 'Selected Category' : 'Specific Dishes'}
                      </span>
                    </div>

                    {/* Restaurant Info */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] overflow-hidden shrink-0 flex items-center justify-center">
                        {cafe.cover_image ? (
                          <img src={cafe.cover_image} alt={cafe.name} className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-6 h-6 text-[#E50914]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-black text-[#252525] truncate">{cafe.name || 'Partner Restaurant'}</h4>
                        <span className="text-[11px] text-[#757575] block truncate">{cafe.city || 'Fine Dining'}</span>
                      </div>
                    </div>

                    {/* Offer Title & Details */}
                    <div>
                      <h3 className="text-base font-black text-[#252525] group-hover:text-[#E50914] transition-colors leading-snug">
                        {offer.title}
                      </h3>
                      {offer.description && (
                        <p className="text-xs text-[#757575] line-clamp-2 mt-1 leading-relaxed">
                          {offer.description}
                        </p>
                      )}
                    </div>

                    {/* Validity */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#E50914] pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Valid until {new Date(offer.end_date).toLocaleDateString()}</span>
                    </div>

                  </div>

                  {/* Call to action */}
                  <div className="mt-5 pt-3.5 border-t border-[#FEE2E2]">
                    <Link
                      href={`/cafes/${cafe.id || ''}`}
                      className="w-full py-2.5 rounded-xl bg-[#FFF5F5] group-hover:bg-[#E50914] text-[#E50914] group-hover:text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <span>Explore Restaurant Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}

