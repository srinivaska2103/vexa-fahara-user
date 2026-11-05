'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarX2, ArrowRight, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyBookings() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-3xl border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] my-4"
    >
      <div className="relative mb-5">
        <div className="w-20 h-20 bg-[#FFF5F5] border border-[#EF5350]/40 rounded-full flex items-center justify-center text-[#E50914] shadow-inner">
          <CalendarX2 className="w-9 h-9 text-[#E50914]" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#E50914] text-white flex items-center justify-center text-xs animate-bounce shadow-md">
          <Coffee size={12} />
        </div>
      </div>

      <h3 className="text-xl font-black text-[#252525] mb-2 tracking-tight">No bookings found</h3>
      <p className="text-stone-500 text-xs sm:text-sm mb-6 max-w-md font-medium leading-relaxed">
        You don&apos;t have any bookings in this category yet. Explore top cafes and make your first instant reservation!
      </p>

      <Link href="/customer/cafe">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-[#B71C1C] to-[#E50914] text-white rounded-2xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-[#B71C1C]/20 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <span>Explore Cafes</span>
          <ArrowRight size={16} />
        </motion.button>
      </Link>
    </motion.div>
  );
}
