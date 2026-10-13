'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FAHARA_LINKS } from '@/app/constants/faharaLinks';

export default function HomeFinalCTA() {
  return (
    <section className="bg-[#FFF8F0] pt-6 pb-14 sm:pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* EXACT REFERENCE FLOATING ROUNDED DARK-BROWN CONTAINER */}
        <div className="relative bg-[#5C3B24] rounded-[28px] sm:rounded-[36px] lg:rounded-[42px] px-6 sm:px-10 lg:px-14 py-8 sm:py-10 lg:py-12 shadow-[0_20px_50px_rgba(44,24,16,0.22)] border border-[#7A5337]/50 overflow-hidden">
          
          {/* BOTANICAL LEAF BRANCH DOODLE ON FAR LEFT (Exact Match to Reference) */}
          <div className="absolute -left-2 sm:left-2 bottom-0 top-0 flex items-center pointer-events-none opacity-30 sm:opacity-40 select-none text-[#C9A98A]">
            <svg width="110" height="150" viewBox="0 0 100 140" fill="currentColor">
              {/* Main curved branch */}
              <path d="M10 135 C 20 90, 45 40, 75 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Leaves branching off */}
              <path d="M18 105 C 10 95, 2 92, 0 85 C 10 82, 22 88, 25 96 Z" />
              <path d="M30 85 C 38 72, 45 68, 55 64 C 52 75, 45 85, 36 90 Z" />
              <path d="M26 65 C 14 55, 10 46, 12 36 C 22 38, 30 48, 32 58 Z" />
              <path d="M48 50 C 60 38, 68 34, 78 32 C 74 44, 65 52, 54 56 Z" />
              <path d="M42 30 C 32 20, 32 10, 36 2 C 45 6, 50 16, 48 24 Z" />
              <path d="M68 22 C 78 12, 85 8, 95 6 C 92 16, 84 24, 73 26 Z" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 text-center lg:text-left pl-0 sm:pl-8 lg:pl-10">
            
            {/* TEXT CONTENT: Bold Serif Heading + Clean Subtitle */}
            <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-tight">
                Ready to Make Your Next Moment Special?
              </h2>
              <p className="text-xs sm:text-sm lg:text-[15px] text-[#EAD8C7] font-medium leading-relaxed">
                Discover your perfect cafe, restaurant or event space with Fahara.
              </p>
            </div>

            {/* ACTION BUTTONS (Exact Match to Reference: Rounded Cream Filled & Outlined Brown) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-3.5 w-full sm:w-auto shrink-0 justify-center">
              
              {/* Button 1: "Explore Venues →" (Warm Cream Filled Button with soft corners) */}
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-[#FFF4E8] hover:bg-white text-[#2C1810] font-bold text-xs sm:text-sm rounded-[18px] sm:rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
              >
                <span>Explore Venues</span>
                <ArrowRight size={14} strokeWidth={2.2} />
              </Link>

              {/* Button 2: "Become a Partner →" (Outlined Thin Border matching reference) */}
              <a 
                href="#become-partner" 
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-transparent hover:bg-white/10 text-white font-bold text-xs sm:text-sm rounded-[18px] sm:rounded-2xl border border-white/40 hover:border-white transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
              >
                <span>Become a Partner</span>
                <ArrowRight size={14} strokeWidth={2.2} />
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

