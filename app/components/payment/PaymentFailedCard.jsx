'use client';

import { XCircle, RefreshCcw, Headset, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PaymentFailedCard({ reason, onRetry }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-9 border border-stone-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.08)] text-center max-w-xl mx-auto w-full relative overflow-hidden font-sans"
    >
      {/* Top Ambient Aura */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Animated Glowing Error Icon */}
      <div className="relative inline-flex items-center justify-center mb-5">
        <div className="absolute inset-0 rounded-full bg-rose-500/15 animate-ping duration-1000" />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 sm:w-22 sm:h-22 bg-gradient-to-tr from-rose-100 via-rose-50 to-rose-100 text-rose-600 rounded-3xl flex items-center justify-center shadow-md border border-rose-200/80 relative z-10"
        >
          <XCircle size={44} className="drop-shadow-xs" />
        </motion.div>
      </div>
      
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2.5">
          Payment Unsuccessful
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">Payment Failed</h2>
        <p className="text-stone-500 text-xs sm:text-sm font-medium mt-2 max-w-md mx-auto leading-relaxed">
          {reason || 'Your bank or payment gateway encountered a processing issue. No funds were debited.'}
        </p>
      </div>
      
      <div className="flex flex-col gap-3">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRetry}
          className="w-full py-3.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white rounded-2xl font-black text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCcw size={16} />
          <span>Retry Payment</span>
        </motion.button>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Link href="/customer/cafe" className="w-full">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="w-full bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60 hover:border-[#6F4E37] py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft size={16} />
              <span>Back To Cafes</span>
            </motion.button>
          </Link>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => window.location.href = 'mailto:vexatech.connect@gmail.com'}
            className="w-full bg-stone-50 text-stone-700 border border-stone-200/80 hover:bg-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Headset size={16} className="text-[#6F4E37]" />
            <span>Contact Support</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
