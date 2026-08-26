'use client';

import EventCard from './EventCard';
import { PackageX, Sparkles, ArrowRight, CalendarCheck, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AvailableEvents({ cafe }) {
  const router = useRouter();
  const events = cafe?.cafe_packages || [];

  if (events.length === 0) {
    return (
      <div className="mb-8" id="packages">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans text-center relative overflow-hidden"
        >
          {/* Ambient Decorative Glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#6F4E37]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-md mx-auto relative z-10 flex flex-col items-center">
            {/* Animated Icon Badge */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#FFF8F0] border-2 border-[#DDB892]/60 flex items-center justify-center text-[#6F4E37] shadow-md mb-5 relative"
            >
              <PackageX size={34} className="text-[#6F4E37]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 animate-ping" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-white font-black">!</span>
            </motion.div>

            {/* Title & Subtitle */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-3 border border-amber-200">
              <Sparkles size={13} className="text-amber-600" />
              <span>General Space Booking Available</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight mb-2">
              No Event Packages Provided by Cafe
            </h3>

            <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed mb-6">
              This cafe currently has no pre-set party packages listed. However, you can still reserve regular tables and custom venue space directly!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/booking/${cafe?.id || 1}`)}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black text-xs rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <CalendarCheck size={16} />
                <span>Book Cafe Space Now</span>
                <ArrowRight size={15} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push('/customer/cafe')}
                className="w-full sm:w-auto px-5 py-3.5 bg-white border border-stone-200 text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] font-black text-xs rounded-2xl shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Coffee size={15} />
                <span>Explore Other Cafes</span>
              </motion.button>
            </div>

          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mb-8" id="packages">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] font-sans">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">Available Event Packages</h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">Choose from curated event packages hosted at this venue.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} cafeId={cafe?.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
