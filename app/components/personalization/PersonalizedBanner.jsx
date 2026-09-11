import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';

export default function PersonalizedBanner() {
  const { user } = useAuthStore();
  
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#2C1810] text-white p-5 sm:p-8 md:p-12 border border-stone-800 shadow-xl group">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80"
          alt="Atmosphere"
          fill
          className="object-cover opacity-25 group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810] via-[#2C1810]/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[#DDB892] font-black tracking-widest uppercase text-[11px] sm:text-xs mb-3"
        >
          <Sparkles size={15} className="text-amber-400" />
          <span>Curated for you</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black mb-3 leading-tight text-white tracking-tight"
        >
          {greeting}, {user?.name || 'Guest'}!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-stone-300 text-xs sm:text-base md:text-lg max-w-lg mb-6 leading-relaxed"
        >
          We've found some incredible cafes and special experiences tailored for your perfect moments.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-3 pt-1"
        >
          <Link href="/customer/cafe">
            <button className="px-5 sm:px-7 py-2.5 sm:py-3 bg-white text-[#2C1810] font-black rounded-xl text-xs sm:text-sm hover:bg-amber-100 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer">
              <Compass className="w-4 h-4 text-[#6F4E37]" />
              <span>Explore Top Picks</span>
            </button>
          </Link>

          <Link href="/customer/cafe">
            <button className="px-5 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black rounded-xl text-xs sm:text-sm hover:from-amber-700 hover:to-amber-800 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer">
              <TrendingUp className="w-4 h-4 text-amber-200" />
              <span>View Trending</span>
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
