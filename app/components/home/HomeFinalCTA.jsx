'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { FAHARA_LINKS } from '@/app/constants/faharaLinks';

export default function HomeFinalCTA() {
  return (
    <section className="bg-[#FFF5F5] pt-6 pb-14 sm:pb-20 relative overflow-hidden" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* THEME-BASED FLOATING ROUNDED RED GRADIENT CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative bg-gradient-to-r from-[#9E0010] via-[#ED0014] to-[#B80012] rounded-[28px] sm:rounded-[36px] lg:rounded-[42px] px-6 sm:px-10 lg:px-14 py-8 sm:py-10 lg:py-12 shadow-[0_20px_50px_rgba(237,0,20,0.28)] border border-white/20 overflow-hidden"
        >
          
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 left-1/4 w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          {/* BOTANICAL LEAF BRANCH DOODLE ON FAR LEFT (Theme Harmonized) */}
          <div className="absolute -left-2 sm:left-2 bottom-0 top-0 flex items-center pointer-events-none opacity-25 select-none text-white">
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
            
            {/* TEXT CONTENT: Clean Modern Heading + Clean Subtitle */}
            <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-white tracking-tight leading-tight">
                Ready to Make Your Next Moment Special?
              </h2>
              <p className="text-xs sm:text-sm lg:text-[15px] text-white/90 font-medium leading-relaxed">
                Discover your perfect cafe, restaurant or event space with Grab2GO.
              </p>
            </div>

            {/* ACTION BUTTONS (Theme Red & Crisp White) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-3.5 w-full sm:w-auto shrink-0 justify-center">
              
              {/* Button 1: "Explore Venues →" (Bright White with Theme Red Text) */}
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-white hover:bg-red-50 text-[#ED0014] font-black text-xs sm:text-sm rounded-[18px] sm:rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer active:scale-95"
              >
                <span>Explore Venues</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>

              {/* Button 2: "Become a Partner →" (Clean White Outline on Red Background) */}
              <a 
                href="#contact" 
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-transparent hover:bg-white/10 text-white font-black text-xs sm:text-sm rounded-[18px] sm:rounded-2xl border-2 border-white/60 hover:border-white transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer active:scale-95"
              >
                <span>Become a Partner</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </a>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}

