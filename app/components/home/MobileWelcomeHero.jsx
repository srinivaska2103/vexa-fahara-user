'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useSearchStore } from '@/stores/search.store';

export default function MobileWelcomeHero({ onOpenFilter }) {
  const user = useAuthStore((state) => state.user);
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);

  return (
    <div className="md:hidden flex flex-col w-full px-4 pt-3 mb-5 select-none">
      {/* ── HERO PROMO BANNER CARD (Warm Cream Card, Limited Time Pill, Made Fresh Title, Burger & Fries Visual, Grab2GO Brown Button) ── */}
      <div className="relative w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-[#FDF6ED] via-[#FBF1E4] to-[#F5E6D3] border border-[#EEDFCF] shadow-[0_4px_20px_rgba(44,24,16,0.06)] p-5 min-h-[220px] flex flex-col justify-between">
        
        {/* Left Column: Limited Time Pill, Bold Title, Subtext, Red Pill Button */}
        <div className="relative z-10 max-w-[62%] flex flex-col items-start space-y-2">
          
          {/* Limited Time Badge */}
          <span className="text-[10px] font-black uppercase tracking-wider text-[#A64B2A] bg-[#FFE8D6] px-2.5 py-0.5 rounded-full border border-[#F4A261]/30">
            LIMITED TIME
          </span>

          {/* Heading */}
          <h2 className="text-xl xs:text-2xl font-black text-[#252525] leading-[1.15] tracking-tight">
            Made Fresh. <br />
            <span className="text-[#E50914]">Made for You.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-[11px] text-[#6D5A50] font-medium leading-snug">
            Real brews, handcrafted bites, made the Grab2GO way.
          </p>

          {/* Grab2GO Theme Action Button */}
          <div className="pt-1.5">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => {
                const el = document.getElementById('all-cafes-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E50914] hover:bg-[#5a3e2b] text-white text-xs font-black shadow-md shadow-[#E50914]/30 active:scale-95 transition-all"
            >
              <span>Explore Now</span>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Right Visual: Warm Burger, Cup & Fries Visual */}
        <div className="absolute right-2 -bottom-2 w-[44%] h-[95%] pointer-events-none flex items-end justify-center">
          <img
            src="/caf5.jpg"
            alt="Grab2GO Featured Meal"
            className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(44,24,16,0.2)] scale-105"
            onError={(e) => {
              // fallback if caf5 fails
              e.currentTarget.src = '/cat_cafes.jpg';
            }}
          />
        </div>

      </div>

    </div>
  );
}
