'use client';

import { CheckCircle2, Sparkles, Gift, ArrowRight, ChevronDown, Wallet, TrendingUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DownloadReceiptButton from './DownloadReceiptButton';
import DownloadInvoiceButton from './DownloadInvoiceButton';
import ShareBookingButton from './ShareBookingButton';
import CelebrationConfetti from '@/app/components/common/CelebrationConfetti';
import { loyaltyService } from '@/services/loyalty.service';

export default function PaymentSuccessCard({ bookingId, transactionId, amount, date }) {
  const [creditsInfo, setCreditsInfo] = useState({
    balance: null,
    earnedNow: 1,
    rupeeValue: null,
    creditsPerRupee: 50,
    loading: true,
    error: false,
  });
  const [expanded, setExpanded] = useState(false);
  const [starPop, setStarPop] = useState(false);

  useEffect(() => {
    async function loadLoyalty() {
      try {
        const res = await loyaltyService.getSummary();
        const data = res?.data || res;
        if (data) {
          const balance = data.credit_balance ?? data.balance ?? 1;
          const creditsPerRupee = data.credits_per_rupee ?? 50;
          const rupeeValue = balance / creditsPerRupee;
          setCreditsInfo({
            balance,
            earnedNow: 1,
            rupeeValue,
            creditsPerRupee,
            loading: false,
            error: false,
          });
          // Trigger star pop animation after data loads
          setTimeout(() => setStarPop(true), 100);
        }
      } catch (err) {
        console.warn('Loyalty info fetch fallback:', err);
        setCreditsInfo((prev) => ({ ...prev, loading: false, error: true }));
      }
    }
    loadLoyalty();
  }, []);

  const rupeeDisplay = creditsInfo.rupeeValue !== null
    ? `~₹${creditsInfo.rupeeValue.toFixed(2)}`
    : '...';

  return (
    <>
      <CelebrationConfetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-9 border border-emerald-200/60 shadow-[0_20px_60px_rgba(16,185,129,0.12)] text-center max-w-xl mx-auto w-full font-sans relative overflow-hidden"
      >
        {/* Ambient glow orbs */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Check icon badge */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping duration-1000" />
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 15 }}
            className="w-20 h-20 bg-gradient-to-tr from-emerald-100 via-emerald-50 to-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center border border-emerald-300/80 shadow-md relative z-10"
          >
            <CheckCircle2 size={44} className="text-emerald-600 drop-shadow-xs" />
          </motion.div>
        </div>

        {/* Title */}
        <div className="mb-5">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2.5 shadow-2xs">
            <Sparkles size={13} className="text-emerald-600" />
            <span>Booking Confirmed</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">Payment Successful!</h2>
          <p className="text-stone-500 font-medium text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
            Your booking is confirmed. A confirmation receipt has been generated and emailed to you.
          </p>
        </div>

        {/* ⭐ Interactive Credit Reward Card */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-6"
        >
          {/* Main reward banner — clickable to expand */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full text-left bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border-2 border-amber-400/60 rounded-3xl p-4 sm:p-5 relative overflow-hidden shadow-sm hover:shadow-md hover:border-amber-500/80 transition-all duration-200 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-expanded={expanded}
            aria-label="View loyalty credit details"
          >
            {/* Badge top-right */}
            <div className="absolute top-0 right-0 translate-x-2 -translate-y-2 bg-amber-400 text-[#2C1810] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
              <Gift size={11} />
              <span>Loyalty Reward</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Animated star icon */}
                <motion.div
                  animate={starPop ? {
                    scale: [1, 1.35, 0.9, 1.15, 1],
                    rotate: [0, -15, 10, -5, 0],
                  } : {}}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0 ring-4 ring-amber-100"
                >
                  ⭐
                </motion.div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-base sm:text-lg text-[#2C1810]">
                      +{creditsInfo.earnedNow} Fahara Credit Added!
                    </h3>
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                      className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                    >
                      Earned
                    </motion.span>
                  </div>

                  {creditsInfo.loading ? (
                    <div className="mt-1 h-4 w-44 bg-amber-200/60 rounded-full animate-pulse" />
                  ) : (
                    <p className="text-stone-600 font-bold text-xs mt-0.5">
                      Total Balance:{' '}
                      <span className="text-[#6F4E37] font-black">{creditsInfo.balance} Credits</span>
                      {' '}({rupeeDisplay})
                    </p>
                  )}
                </div>
              </div>

              {/* Chevron toggle */}
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 group-hover:bg-amber-200 transition-colors"
              >
                <ChevronDown size={16} />
              </motion.div>
            </div>
          </button>

          {/* Expandable credit detail panel */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="credit-details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="bg-amber-50 border-2 border-t-0 border-amber-400/50 rounded-b-3xl px-5 pt-4 pb-5 text-left space-y-3">
                  {/* Credits earned this booking */}
                  <div className="flex items-center justify-between py-2 border-b border-amber-200/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                      <Star size={14} className="text-amber-500 fill-amber-400" />
                      Earned This Booking
                    </div>
                    <span className="font-black text-sm text-emerald-700">+{creditsInfo.earnedNow} Credit</span>
                  </div>

                  {/* Total balance */}
                  <div className="flex items-center justify-between py-2 border-b border-amber-200/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                      <Wallet size={14} className="text-amber-600" />
                      Total Credit Balance
                    </div>
                    {creditsInfo.loading ? (
                      <div className="h-4 w-20 bg-amber-200 rounded animate-pulse" />
                    ) : (
                      <span className="font-black text-sm text-[#6F4E37]">{creditsInfo.balance} Credits</span>
                    )}
                  </div>

                  {/* Rupee value */}
                  <div className="flex items-center justify-between py-2 border-b border-amber-200/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                      <TrendingUp size={14} className="text-emerald-600" />
                      Wallet Value
                    </div>
                    {creditsInfo.loading ? (
                      <div className="h-4 w-16 bg-amber-200 rounded animate-pulse" />
                    ) : (
                      <span className="font-black text-sm text-emerald-700">{rupeeDisplay}</span>
                    )}
                  </div>

                  {/* Rate info */}
                  <p className="text-[11px] text-stone-500 font-medium text-center pt-1">
                    1 Credit = ₹{creditsInfo.creditsPerRupee > 0 ? (1 / creditsInfo.creditsPerRupee).toFixed(2) : '0.02'} · Earn 1 Credit per booking
                  </p>

                  {/* View Wallet — always visible inside panel, even on mobile */}
                  <Link href="/customer/profile?tab=loyalty">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      className="mt-1 w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-[#2C1810] font-black text-sm py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <Wallet size={16} />
                      <span>View My Wallet</span>
                      <ArrowRight size={15} />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick View Wallet button — always visible on mobile outside panel */}
          {!expanded && (
            <div className="mt-2 flex justify-end">
              <Link href="/customer/profile?tab=loyalty">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white hover:bg-amber-50 text-[#6F4E37] border border-amber-300 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Wallet size={13} />
                  <span>View Wallet</span>
                  <ArrowRight size={13} />
                </motion.div>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Receipt Details */}
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

        {/* Action Buttons */}
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
