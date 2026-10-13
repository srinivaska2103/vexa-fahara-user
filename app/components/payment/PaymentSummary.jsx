'use client';

import { useState } from 'react';
import BookingSummaryCard from './BookingSummaryCard';
import OrderSummary from './OrderSummary';
import PaymentMethodCard from './PaymentMethodCard';
import MobileCheckoutView from './MobileCheckoutView';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ShieldCheck, Lock } from 'lucide-react';

export default function PaymentSummary({ bookingData, priceData, onProceed }) {
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProceed = async () => {
    if (selectedMethod !== 'razorpay') {
      toast.error('Please select Razorpay Payments to proceed');
      return;
    }
    setIsProcessing(true);
    await onProceed(selectedMethod);
    setIsProcessing(false);
  };

  return (
    <>
      {/* ================================================================== */}
      {/* MOBILE COMPACT CHECKOUT VIEW (md:hidden) — Matches Reference 1     */}
      {/* ================================================================== */}
      <MobileCheckoutView 
        bookingData={bookingData}
        priceData={priceData}
        onProceed={handleProceed}
        isProcessing={isProcessing}
      />

      {/* ================================================================== */}
      {/* DESKTOP CHECKOUT & PAYMENT VIEW (hidden md:block) — Preserved      */}
      {/* ================================================================== */}
      <div className="hidden md:block min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-16">
        
        {/* Top Navbar */}
        <CustomerNavbar showSearch={true} showViewToggles={false} />

        <main className="container mx-auto px-6 lg:px-8 py-5 max-w-7xl overflow-x-hidden">
          
          {/* Page Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                  Step 3 of 3 • Payment & Checkout
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#2C1810] tracking-tight">Checkout & Payment</h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">Review your reserved items and complete your instant booking.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
                <Lock size={14} className="text-emerald-600 shrink-0" />
                <span>Encrypted Payment</span>
              </span>
            </div>
          </div>
          
          {/* 2-Column Responsive Grid Layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative items-start">
            
            {/* Left Main Content Column */}
            <div className="lg:w-7/12 xl:w-2/3 min-w-0 space-y-6 w-full">
              <BookingSummaryCard bookingData={bookingData} />
              <PaymentMethodCard 
                selectedMethod={selectedMethod} 
                onSelectMethod={setSelectedMethod} 
              />
            </div>
            
            {/* Right Sticky Order Summary Column */}
            <div className="lg:w-5/12 xl:w-1/3 w-full sticky top-24">
              <div className="space-y-4">
                <OrderSummary priceData={priceData} />
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleProceed}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#4A2C11] via-[#5A3825] to-[#6F4E37] hover:from-[#38200b] hover:to-[#5c402d] text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-[#4A2C11]/25 hover:shadow-xl transition-all cursor-pointer flex justify-center items-center gap-2 disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Pay ₹{priceData?.grandTotal?.toFixed(2) || '0.00'}</span>
                      <ShieldCheck size={18} className="text-amber-200" />
                    </>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-stone-500 bg-white/60 backdrop-blur-md py-2.5 px-4 rounded-2xl border border-stone-200/60 shadow-2xs">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  <span>Instant Venue Confirmation Guaranteed</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
