'use client';

import { CheckCircle2, PartyPopper, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DownloadReceiptButton from './DownloadReceiptButton';
import DownloadInvoiceButton from './DownloadInvoiceButton';
import ShareBookingButton from './ShareBookingButton';
import CelebrationConfetti from '@/app/components/common/CelebrationConfetti';

export default function PaymentSuccessCard({ bookingId, transactionId, amount, date }) {
  return (
    <>
      {/* Festive Falling & Floating Confetti Decoration Papers */}
      <CelebrationConfetti />

      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-9 border border-emerald-200/60 shadow-[0_20px_60px_rgba(16,185,129,0.12)] text-center max-w-xl mx-auto w-full font-sans relative overflow-hidden"
      >
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Celebration Icon Badge */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping duration-1000" />
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            className="w-20 h-20 sm:w-22 sm:h-22 bg-gradient-to-tr from-emerald-100 via-emerald-50 to-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center border border-emerald-300/80 shadow-md relative z-10"
          >
            <CheckCircle2 size={44} className="text-emerald-600 drop-shadow-xs" />
          </motion.div>
        </div>
        
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2.5 shadow-2xs">
            <Sparkles size={13} className="text-emerald-600" />
            <span>Booking Confirmed</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">Payment Successful!</h2>
          <p className="text-stone-500 font-medium text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
            Your booking is confirmed. A confirmation receipt has been generated and emailed to you.
          </p>
        </div>
        
        {/* Receipt Details Box */}
        <div className="bg-gradient-to-br from-[#FFF8F0] via-[#FFF8F0]/80 to-[#F5EBE0]/60 border border-[#DDB892]/50 rounded-3xl p-5 sm:p-6 mb-6 text-left space-y-3.5 shadow-2xs">
          <div className="flex justify-between items-center border-b border-[#DDB892]/30 pb-2.5">
            <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">Booking ID</span>
            <span className="font-black text-xs sm:text-sm text-[#2C1810] font-mono bg-white px-3 py-1 rounded-xl border border-stone-200/80 shadow-2xs">{bookingId}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#DDB892]/30 pb-2.5">
            <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">Transaction ID</span>
            <span className="font-black text-xs sm:text-sm text-[#2C1810] font-mono truncate max-w-[180px] sm:max-w-[240px] text-right">{transactionId}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#DDB892]/30 pb-2.5">
            <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">Payment Date</span>
            <span className="font-black text-xs sm:text-sm text-[#2C1810]">{date}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs sm:text-sm font-black text-[#2C1810]">Total Paid</span>
            <span className="font-black text-[#2C1810] text-2xl sm:text-3xl tracking-tight">₹{amount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center mb-6">
          <DownloadReceiptButton bookingId={bookingId} />
          <DownloadInvoiceButton bookingId={bookingId} />
          <ShareBookingButton bookingId={bookingId} />
        </div>

        <Link href="/customer/bookings">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="w-full bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Go To My Bookings
          </motion.button>
        </Link>
      </motion.div>
    </>
  );
}
