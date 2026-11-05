'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, Bike, ShoppingBag } from 'lucide-react';

export default function FoodHeroPromoBanner({ activeOffer = null, featuredCafeId = null }) {
  const discountText = activeOffer 
    ? (activeOffer.discount_type === 'PERCENTAGE' ? `${activeOffer.discount_value}% OFF` : `₹${activeOffer.discount_value} OFF`)
    : '20% OFF';

  const promoTitle = activeOffer?.title || 'Delicious food, delivered fast';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E50914] via-[#D32F2F] to-[#B71C1C] text-white shadow-lg shadow-[#E50914]/20 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#B71C1C]/30">
      
      {/* Left Marketing Copy */}
      <div className="space-y-4 max-w-xl z-10 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs">
          <Sparkles size={12} className="text-amber-300" />
          <span>Fresh &amp; Hot Everyday</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-white tracking-tight leading-[1.15]">
            Delicious food, <br className="hidden sm:inline" />
            <span>delivered fast</span>
          </h1>

          <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed max-w-md">
            Order from your favourite local restaurants and get it delivered right to your doorstep or ready for pickup.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => {
              const el = document.getElementById('popular-restaurants-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-[#E50914] text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span>Order Now</span>
            <ArrowRight size={14} className="text-[#E50914]" />
          </button>
        </div>
      </div>

      {/* Right Floating Hot Deal Badge Card (without the image) */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div className="bg-white/15 backdrop-blur-md rounded-3xl border border-white/25 p-5 sm:p-6 shadow-xl space-y-2 min-w-[200px] text-center select-none">
          <div className="inline-flex items-center gap-1 text-amber-300">
            <Flame size={16} className="fill-amber-300" />
            <span className="text-[11px] font-black uppercase tracking-wider text-white">Hot Deal</span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight">
            {discountText}
          </div>

          <p className="text-[11px] text-white/80 font-bold leading-tight">
            on selected restaurants &amp; items
          </p>

          <button
            onClick={() => {
              const el = document.getElementById('popular-restaurants-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center gap-1 text-xs font-black text-white hover:underline pt-1 cursor-pointer"
          >
            <span>Claim Discount</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

    </div>
  );
}
