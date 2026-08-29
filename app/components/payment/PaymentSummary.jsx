'use client';

import { useState } from 'react';
import BookingSummaryCard from './BookingSummaryCard';
import OrderSummary from './OrderSummary';
import PaymentMethodCard from './PaymentMethodCard';
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
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-16">
      
      {/* Top Navbar */}
      <CustomerNavbar showSearch={true} showViewToggles={false} />

      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 max-w-full overflow-x-hidden">
        
        {/* Page Title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#2C1810] tracking-tight">Checkout</h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">Review your booking summary and select your payment method.</p>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
            <Lock size={13} className="text-emerald-600" />
            <span>Encrypted Payment</span>
          </span>
        </div>
        
        {/* 2-Column Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8 relative items-start">
          
          {/* Left Column (65% width) */}
          <div className="lg:w-2/3 min-w-0 space-y-6 w-full">
            <BookingSummaryCard bookingData={bookingData} />
            <PaymentMethodCard 
              selectedMethod={selectedMethod} 
              onSelectMethod={setSelectedMethod} 
            />
          </div>
          
          {/* Right Summary Column (35% width) */}
          <div className="lg:w-1/3 w-full sticky top-[7.5rem]">
            <div className="space-y-6">
              <OrderSummary priceData={priceData} />
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleProceed}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-[#4A2C11]/20 hover:shadow-xl transition-all cursor-pointer flex justify-center items-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ₹${priceData?.grandTotal?.toFixed(2) || '0.00'}`}
              </motion.button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-stone-400">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Instant Confirmation Guaranteed</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
