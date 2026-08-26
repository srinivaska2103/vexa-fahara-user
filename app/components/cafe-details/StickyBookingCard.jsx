'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { checkIfCafeOpen } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function StickyBookingCard({ cafe }) {
  const router = useRouter();

  const { id } = cafe || {};
  const isOpen = checkIfCafeOpen(cafe);

  const handleStartBooking = () => {
    if (!isOpen) return;
    router.push(`/booking/${id || 1}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.08)] p-5 sm:p-6 sticky top-[11.5rem] z-20 font-sans w-full">
      
      {/* Primary CTA Button */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleStartBooking}
        disabled={!isOpen}
        className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
          isOpen 
            ? "bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-lg shadow-[#4A2C11]/20 cursor-pointer" 
            : "bg-stone-200 text-stone-400 cursor-not-allowed"
        }`}
      >
        <span>{isOpen ? 'Book Now' : "Cafe Closed"}</span>
        {isOpen && <ArrowRight size={16} />}
      </motion.button>
      
      {!isOpen && (
        <div className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-100 mt-3 font-medium">
          <Info size={15} className="mt-0.5 flex-shrink-0 text-rose-500" />
          <p>This venue is currently closed and not accepting slot reservations.</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-stone-400">
        <ShieldCheck size={14} className="text-emerald-600" />
        <span>Instant Confirmation & Free Cancellation</span>
      </div>

    </div>
  );
}
