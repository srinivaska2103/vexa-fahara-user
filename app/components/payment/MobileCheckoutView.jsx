'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  HelpCircle, 
  Tag, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Coffee,
  User,
  Phone,
  Mail,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MobileCheckoutView({
  bookingData,
  priceData,
  onProceed,
  isProcessing
}) {
  const router = useRouter();

  // Accordion state for optional details & address/instructions
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  if (!bookingData) return null;

  const {
    bookingNumber,
    cafeName,
    cafeImage,
    address,
    date,
    time,
    duration,
    guests,
    eventCompany,
    eventPackage,
    packageInclusions = [],
    specialRequest,
    eventSpecialRequest,
    customerName,
    customerEmail,
    customerPhone,
    managerName
  } = bookingData;

  // Pricing values from authoritative calculation
  const grandTotal = Number(priceData?.grandTotal || 0);
  const subtotal = Number(priceData?.subtotal || 0);
  const cafeCharges = Number(priceData?.cafeCharges || 0);
  const eventCharges = Number(priceData?.eventCharges || 0);
  const additionalCharges = Number(priceData?.additionalCharges || 0);
  const platformFee = typeof priceData?.platformFee === 'object' && priceData?.platformFee !== null 
    ? Number(priceData.platformFee.amount || 0) 
    : Number(priceData?.platformFee || 0);
  const transactionFee = typeof priceData?.transactionFee === 'object' && priceData?.transactionFee !== null 
    ? Number(priceData.transactionFee.amount || 0) 
    : Number(priceData?.transactionFee || 0);
  const gst = typeof priceData?.gst === 'object' && priceData?.gst !== null 
    ? Number(priceData.gst.amount || 0) 
    : Number(priceData?.gst || 0);
  const backendDiscount = Number(priceData?.discount || 0);

  // Inclusions or package line item title
  const mainItemTitle = eventPackage 
    ? `${cafeName || 'Venue'} + ${eventPackage}` 
    : (cafeName || 'Reserved Venue');

  const handleHelpClick = () => {
    toast('Need assistance? Our concierge is available at support@fahara.com', {
      icon: '💬',
      style: {
        borderRadius: '16px',
        background: '#2C1810',
        color: '#fff',
        fontSize: '12px'
      }
    });
  };

  return (
    <div className="md:hidden min-h-screen bg-[#FFF8F0] font-sans antialiased text-[#2C1810] flex flex-col pb-32">
      {/* ------------------------------------------------------------------ */}
      {/* 1. MINIMAL CHECKOUT HEADER (Reference Image 1)                     */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#E8DED5]/80 px-4 py-3.5 flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => router.back()}
          aria-label="Back to booking"
          className="w-9 h-9 rounded-full bg-white border border-[#E8DED5] flex items-center justify-center text-[#2C1810] shadow-xs active:bg-stone-100 cursor-pointer"
        >
          <ArrowLeft size={18} strokeWidth={2.2} />
        </motion.button>

        <h1 className="text-base font-black text-[#2C1810] tracking-tight">Checkout</h1>

        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleHelpClick}
          aria-label="Help and Support"
          className="w-9 h-9 rounded-full bg-white border border-[#E8DED5] flex items-center justify-center text-stone-500 hover:text-[#6F4E37] shadow-xs cursor-pointer"
        >
          <HelpCircle size={17} />
        </motion.button>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CHECKOUT BODY CONTENT                                         */}
      {/* ------------------------------------------------------------------ */}
      <main className="p-3.5 xs:p-4 space-y-3.5">
        
        {/* ---------------------------------------------------------------- */}
        {/* 2. COMPACT BOOKING SUMMARY ROW (Reference Image 1)               */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-3.5 border border-[#E8DED5] shadow-[0_2px_12px_rgba(44,24,16,0.03)] flex gap-3.5 items-center">
          {/* Venue Thumbnail Image */}
          <div className="w-20 h-20 xs:w-22 xs:h-22 rounded-2xl overflow-hidden relative shrink-0 bg-[#FFF8F0] border border-[#E8DED5]">
            {cafeImage ? (
              <Image 
                src={cafeImage} 
                alt={cafeName || 'Venue'} 
                fill 
                className="object-cover"
                sizes="88px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#6F4E37]">
                <Coffee size={26} />
              </div>
            )}
          </div>

          {/* Venue & Booking Meta */}
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-sm font-black text-[#2C1810] leading-snug line-clamp-2">
              {mainItemTitle}
            </h2>

            {/* Price Pill */}
            <div className="text-xs font-black text-[#6F4E37] tracking-tight pt-0.5">
              ₹{grandTotal.toFixed(2)}
            </div>

            {/* Compact Key Stats */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500 font-bold pt-0.5">
              <span className="flex items-center gap-1 text-stone-600">
                <Calendar size={11} className="text-[#6F4E37] shrink-0" />
                <span className="truncate">{date}</span>
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1 text-stone-600">
                <Clock size={11} className="text-[#6F4E37] shrink-0" />
                <span className="truncate">{time}</span>
              </span>
            </div>

            {bookingNumber && (
              <div className="text-[10px] font-mono font-bold text-stone-400">
                Ref: {bookingNumber}
              </div>
            )}
          </div>
        </div>



        {/* ---------------------------------------------------------------- */}
        {/* 4. COMPACT ORDER SUMMARY BREAKDOWN (Reference Image 1)           */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-4 border border-[#E8DED5] shadow-[0_2px_12px_rgba(44,24,16,0.03)] space-y-3">
          <h3 className="text-xs font-black text-[#2C1810] uppercase tracking-wider">
            Order Summary
          </h3>

          <div className="space-y-2 text-xs divide-y divide-stone-100">
            {/* Booking / Base Venue Charges */}
            <div className="flex justify-between items-center pt-1 font-bold text-stone-600">
              <span className="truncate pr-2">
                {eventPackage ? 'Event Package' : 'Venue Reservation'}
                {duration && <span className="text-[10px] text-stone-400 ml-1 font-normal">({duration})</span>}
              </span>
              <span className="font-black text-[#2C1810] shrink-0">
                ₹{(cafeCharges > 0 ? cafeCharges : subtotal).toFixed(2)}
              </span>
            </div>

            {/* Additional Services / Food / Extras if any */}
            {(eventCharges > 0 && eventCharges !== subtotal) && (
              <div className="flex justify-between items-center pt-2 font-bold text-stone-600">
                <span className="truncate pr-2">Event Arrangement</span>
                <span className="font-black text-[#2C1810] shrink-0">₹{eventCharges.toFixed(2)}</span>
              </div>
            )}

            {additionalCharges > 0 && (
              <div className="flex justify-between items-center pt-2 font-bold text-stone-600">
                <span className="truncate pr-2">Additional Services</span>
                <span className="font-black text-[#2C1810] shrink-0">₹{additionalCharges.toFixed(2)}</span>
              </div>
            )}

            {/* Platform Fee */}
            {platformFee > 0 && (
              <div className="flex justify-between items-center pt-2 font-bold text-stone-600">
                <span className="truncate pr-2">Platform Fee</span>
                <span className="font-black text-[#2C1810] shrink-0">₹{platformFee.toFixed(2)}</span>
              </div>
            )}

            {/* Transaction Fee */}
            {transactionFee > 0 && (
              <div className="flex justify-between items-center pt-2 font-bold text-stone-600">
                <span className="truncate pr-2">Transaction Fee</span>
                <span className="font-black text-[#2C1810] shrink-0">₹{transactionFee.toFixed(2)}</span>
              </div>
            )}

            {/* GST */}
            {gst > 0 && (
              <div className="flex justify-between items-center pt-2 font-bold text-stone-600">
                <span className="truncate pr-2">GST</span>
                <span className="font-black text-[#2C1810] shrink-0">₹{gst.toFixed(2)}</span>
              </div>
            )}

            {/* Discount */}
            {backendDiscount > 0 && (
              <div className="flex justify-between items-center pt-2 font-bold text-emerald-600">
                <span className="truncate pr-2">Discount</span>
                <span className="font-black shrink-0">-₹{backendDiscount.toFixed(2)}</span>
              </div>
            )}

            {/* Subtotal Separator & Total Amount */}
            <div className="flex justify-between items-center pt-2.5 font-black text-sm text-[#2C1810]">
              <span>Total Amount</span>
              <span className="text-[#6F4E37] text-base font-black">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 5. ADDRESS & BOOKING DETAILS EXPANDABLE ROW (Ref Image 1)         */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-[#E8DED5] shadow-[0_2px_8px_rgba(44,24,16,0.02)] overflow-hidden">
          <button
            type="button"
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-stone-50/70 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0 mr-2">
              <MapPin size={15} className="text-[#6F4E37] shrink-0" />
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0">
                Address
              </span>
              <span className="text-xs font-black text-[#2C1810] truncate">
                {address || cafeName || 'Venue Location'}
              </span>
            </div>
            <div className="text-stone-400 shrink-0">
              {isDetailsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {/* Expanded Content with Inclusions, Contact & Special Requests */}
          <AnimatePresence>
            {isDetailsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4 pt-1 border-t border-stone-100 text-xs space-y-3"
              >
                {/* Full Address */}
                {address && (
                  <div>
                    <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Location</span>
                    <p className="text-stone-700 font-semibold leading-relaxed">{address}</p>
                  </div>
                )}

                {/* Guests */}
                <div className="flex items-center gap-2 text-stone-600 font-medium">
                  <Users size={14} className="text-[#6F4E37]" />
                  <span>{guests} {guests === 1 ? 'Guest' : 'Guests'} confirmed</span>
                </div>

                {/* Customer Contact */}
                {(customerName || customerPhone) && (
                  <div className="bg-[#FFF8F0] p-2.5 rounded-xl border border-[#E8DED5]/70 space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#6F4E37] block">Contact Details</span>
                    {customerName && <p className="font-black text-[#2C1810]">{customerName}</p>}
                    {customerPhone && <p className="text-stone-600 font-bold text-[11px]">{customerPhone}</p>}
                    {customerEmail && <p className="text-stone-500 text-[11px] truncate">{customerEmail}</p>}
                  </div>
                )}

                {/* Inclusions summary */}
                {packageInclusions.length > 0 && (
                  <div>
                    <span className="text-[10px] font-black uppercase text-stone-400 block mb-1">Package Inclusions</span>
                    <ul className="space-y-1">
                      {packageInclusions.map((inc, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-stone-700 font-medium text-[11px]">
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                          <span className="truncate">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Special Requests */}
                {(specialRequest || eventSpecialRequest) && (
                  <div>
                    <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Special Instructions</span>
                    <p className="text-stone-700 italic text-[11px] bg-stone-50 p-2 rounded-lg border border-stone-100">
                      &ldquo;{specialRequest || eventSpecialRequest}&rdquo;
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security badge row */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-stone-500 py-1">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>256-bit encrypted secure checkout via Razorpay</span>
        </div>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* 6. FIXED BOTTOM PAYMENT BAR (Reference Image 1)                    */}
      {/* ------------------------------------------------------------------ */}
      <footer className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E8DED5] px-4 py-3 shadow-[0_-8px_24px_rgba(44,24,16,0.08)]">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          {/* Total Payable Display */}
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">
              Total Payable
            </span>
            <div className="text-lg xs:text-xl font-black text-[#2C1810] tracking-tight">
              ₹{grandTotal.toFixed(2)}
            </div>
          </div>

          {/* Primary Pay Now Action */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onProceed}
            disabled={isProcessing}
            type="button"
            className="flex-1 py-3.5 px-6 rounded-2xl bg-[#6F4E37] hover:bg-[#583D2B] active:bg-[#4A2C11] text-white font-black text-sm tracking-wide shadow-md shadow-[#6F4E37]/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <span>Proceed to Pay</span>
            )}
          </motion.button>
        </div>
      </footer>
    </div>
  );
}
