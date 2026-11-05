'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, Compass, ArrowRight, Sparkles, ShoppingBag, Calendar, Store, Bike } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeDualChoiceSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#E50914] bg-[#FFF5F5] px-3.5 py-1 rounded-full border border-[#EF5350]/40 inline-flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Grab2GO Experience</span>
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#252525] tracking-tight">
          How would you like to experience Grab2GO today?
        </h2>
        <p className="text-xs sm:text-sm text-[#757575] font-medium">
          Whether you want fresh meals delivered to your doorstep or wish to book a table for your special occasion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* OPTION A: ORDER FOOD */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#FFF5F5] border-2 border-[#FEE2E2] hover:border-[#E50914] p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center border border-[#EF5350]/40 group-hover:scale-110 group-hover:bg-[#E50914] group-hover:text-white transition-all shadow-sm">
                <Utensils className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#E50914] border border-red-200">
                Takeaway &amp; Delivery
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
                Craving Something Delicious?
              </h3>
              <p className="text-xs sm:text-sm text-[#757575] leading-relaxed font-medium">
                Discover restaurants, explore delicious menus and order your favourite food with live discounts and instant order tracking.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-xl bg-white border border-[#FEE2E2] text-[11px] font-bold text-[#252525] flex items-center gap-1 shadow-2xs">
                <Bike className="w-3 h-3 text-[#E50914]" /> Restaurant Delivery
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-white border border-[#FEE2E2] text-[11px] font-bold text-[#252525] flex items-center gap-1 shadow-2xs">
                <ShoppingBag className="w-3 h-3 text-orange-600" /> Self Pickup
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-white border border-[#FEE2E2] text-[11px] font-bold text-[#252525] flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-500" /> Live Special Offers
              </span>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/customer/food"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <span>Explore Food</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* OPTION B: DISCOVER & BOOK PLACES */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-amber-50/30 border-2 border-[#FEE2E2] hover:border-amber-500 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                <Compass className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                Dine-In &amp; Events
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
                Discover Places. Create Memories.
              </h3>
              <p className="text-xs sm:text-sm text-[#757575] leading-relaxed font-medium">
                Find amazing cafes, restaurants and event venues for your special moments, date nights, birthdays, and celebrations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-[11px] font-bold text-[#252525] flex items-center gap-1 shadow-2xs">
                <Store className="w-3 h-3 text-indigo-600" /> Table Reservations
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-[11px] font-bold text-[#252525] flex items-center gap-1 shadow-2xs">
                <Calendar className="w-3 h-3 text-emerald-600" /> Event Packages
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-[11px] font-bold text-[#252525] flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-600" /> Venue Amenities
              </span>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/customer/cafe"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#252525] hover:bg-black text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <span>Explore Places</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

