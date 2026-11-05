'use client';

import React from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

export default function MobileFoodPromoCard({ activeOffer = null }) {
  const discountText = activeOffer 
    ? (activeOffer.discount_type === 'PERCENTAGE' ? `${activeOffer.discount_value}% OFF` : `₹${activeOffer.discount_value} OFF`)
    : '20% OFF';

  const scrollToRestaurants = () => {
    const el = document.getElementById('popular-restaurants-section') || document.getElementById('all-restaurants-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#E50914] via-[#D32F2F] to-[#991B1B] text-white p-5 shadow-lg shadow-red-950/20 border border-white/15">
      {/* Subtle background glow/particles */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

      {/* Top Tag & Hot Deal Badge Row */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
          <Sparkles size={11} className="text-amber-300" />
          <span>Fresh &amp; Hot Everyday</span>
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[10px] font-black uppercase tracking-wider">
          <Flame size={12} className="fill-amber-400 text-amber-400" />
          <span>Hot Deal</span>
        </div>
      </div>

      {/* Main Headline */}
      <div className="space-y-1.5 relative z-10 mb-4">
        <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
          Delicious food, <br />
          <span className="text-amber-200">delivered fast</span>
        </h2>
        <p className="text-xs text-white/90 font-medium leading-relaxed">
          Order from your favourite local restaurants and get it delivered right to your doorstep or ready for pickup.
        </p>
      </div>

      {/* Embedded 20% OFF Deal Card + Order Now Button */}
      <div className="relative z-10 bg-white/12 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex items-center justify-between gap-3 shadow-inner">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white leading-none tracking-tight">{discountText}</span>
            <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">Deal</span>
          </div>
          <p className="text-[10px] text-white/80 font-medium leading-tight mt-0.5">
            on selected restaurants
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToRestaurants}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#E50914] text-xs font-black shadow-md hover:bg-stone-50 active:scale-95 transition-transform cursor-pointer shrink-0"
        >
          <span>Order Now</span>
          <ArrowRight size={13} className="text-[#E50914]" />
        </button>
      </div>
    </div>
  );
}

