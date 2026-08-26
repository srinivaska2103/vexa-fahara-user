'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/stores/booking.store';
import { useCafeDetails } from '@/hooks/useCafeDetails';
import { ArrowLeft, ChevronRight, ShieldCheck, Sparkles, Check, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Redesigned Components & Layout Headers
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import EventArrangementSection from '@/app/components/booking-redesign/EventArrangementSection';
import EventPackageSection from '@/app/components/booking-redesign/EventPackageSection';
import BookingInformationForm from '@/app/components/booking-redesign/BookingInformationForm';
import StickyBookingSummary from '@/app/components/booking-redesign/StickyBookingSummary';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';

export default function RedesignedBookingPage() {
  const { id: cafeId } = useParams();
  const router = useRouter();
  const { setCafeId, setCafePrice, reset, cafeId: storeCafeId, pricing } = useBookingStore();
  const [activeStepTab, setActiveStepTab] = useState('packages');
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  
  const { data: cafeResponse, isLoading, error } = useCafeDetails(cafeId);
  const cafe = cafeResponse?.data;

  // Step List for Booking Process
  const stepsList = [
    { id: 'packages', step: '01', label: 'Packages & Services' },
    { id: 'info', step: '02', label: 'Date & Guest Info' },
  ];

  // Initialize store with cafeId and price
  useEffect(() => {
    if (cafeId) {
      if (storeCafeId && storeCafeId !== cafeId) {
        reset();
      }
      setCafeId(cafeId);
    }
  }, [cafeId, setCafeId, reset, storeCafeId]);

  useEffect(() => {
    if (cafe && cafe.price_per_hour) {
       setCafePrice(cafe.price_per_hour);
    }
  }, [cafe, setCafePrice]);

  if (isLoading) {
    return (
      <FaharaInteractiveLoader 
        message="Preparing your booking experience..." 
        badgeTag="FAHARA RESERVATION" 
        fullScreen={true} 
      />
    );
  }

  if (error || !cafe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] p-4 text-center">
        <h2 className="text-2xl font-black text-[#2C1810] mb-2">Cafe Not Found</h2>
        <p className="text-stone-500 text-sm mb-6 max-w-md">The cafe you are trying to book might have been removed or is temporarily unavailable.</p>
        <Link href="/customer/cafe" className="px-6 py-3 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all">
          Back to Discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-12">
      
      {/* Top Navbar */}
      <CustomerNavbar showSearch={true} showViewToggles={false} />

      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
        
        {/* Navigation Breadcrumb Row */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <Link href={`/cafes/${cafeId}`} className="inline-flex items-center text-xs sm:text-sm font-extrabold bg-white hover:bg-[#FFF8F0] hover:text-[#6F4E37] text-stone-700 px-3.5 py-2 rounded-2xl border border-stone-200/80 transition-all shadow-2xs">
            <ArrowLeft size={15} className="mr-1.5 shrink-0" />
            <span className="truncate">Back to {cafe.name || 'Venue'}</span>
          </Link>

          <span className="text-[10px] sm:text-xs font-black text-[#6F4E37] bg-white border border-[#DDB892]/60 px-3 py-1.5 rounded-full shadow-2xs flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            <span>Instant Reservation</span>
          </span>
        </div>

        {/* STEP-BY-STEP SECTION NAVIGATION BAR */}
        <div className="relative md:sticky md:top-[4.5rem] z-30 mb-5 bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl sm:rounded-full p-1 sm:p-1.5 shadow-[0_8px_25px_rgba(44,24,16,0.05)] overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max px-0.5">
            {stepsList.map((item) => {
              const isActive = activeStepTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveStepTab(item.id);
                    const el = document.getElementById(`step-${item.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all duration-300 cursor-pointer active:scale-95 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-md shadow-[#4A2C11]/25' 
                      : 'bg-stone-50/90 hover:bg-[#FFF8F0] hover:text-[#6F4E37] text-stone-700 border border-stone-200/60 font-bold'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] transition-colors ${
                    isActive ? 'bg-white text-[#4A2C11]' : 'bg-[#6F4E37] text-white'
                  }`}>
                    {item.step}
                  </span>
                  <span className="tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Balanced Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Content Area (7/12 cols desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5 min-w-0">
            
            {/* Step 1 Tab Content: Packages & Services */}
            {activeStepTab === 'packages' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} id="step-packages">
                {(!cafe.cafe_packages || cafe.cafe_packages.length === 0) && (
                  <EventArrangementSection />
                )}
                <EventPackageSection cafe={cafe} />
              </motion.div>
            )}

            {/* Step 2 Tab Content: Date & Guest Info */}
            {activeStepTab === 'info' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} id="step-info">
                <BookingInformationForm />
              </motion.div>
            )}

            {/* Interactive Step Navigation Controls */}
            <div className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl shadow-sm">
              <button
                onClick={() => {
                  if (activeStepTab === 'info') setActiveStepTab('packages');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={activeStepTab === 'packages'}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs border transition-all cursor-pointer ${
                  activeStepTab === 'packages'
                    ? 'opacity-40 bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                    : 'bg-white text-[#2C1810] border-stone-300 hover:bg-stone-50'
                }`}
              >
                &larr; Previous Step
              </button>

              <div className="text-xs font-black text-[#6F4E37]">
                Step {activeStepTab === 'packages' ? '1 of 2' : '2 of 2'}
              </div>

              <button
                onClick={() => {
                  if (activeStepTab === 'packages') setActiveStepTab('info');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={activeStepTab === 'info'}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                  activeStepTab === 'info'
                    ? 'opacity-40 bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-md hover:shadow-lg'
                }`}
              >
                Next Step &rarr;
              </button>
            </div>
          </div>
          
          {/* Right Summary Column (5/12 cols desktop - Sticky) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-[5.5rem] self-start">
            <StickyBookingSummary cafeName={cafe.name} />
          </div>

        </div>
      </main>

      {/* MOBILE STICKY BOTTOM ACTION DRAWER */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-stone-200/90 shadow-[0_-10px_30px_rgba(44,24,16,0.12)] p-3 px-4 select-none print:hidden">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="flex flex-col text-left cursor-pointer group"
          >
            <div className="flex items-center text-[10px] font-black uppercase text-stone-400">
              <span>Grand Total</span>
              <ChevronUp size={14} className={`ml-1 text-[#6F4E37] transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`} />
            </div>
            <span className="text-lg font-black text-[#2C1810]">
              ₹{Number((pricing?.total || 0).toFixed(2)).toLocaleString()}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="px-6 py-3 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black text-xs rounded-2xl shadow-lg shadow-[#4A2C11]/25 hover:shadow-xl active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>{mobileSummaryOpen ? 'Hide Breakdown' : 'Book Now & Pay'}</span>
            <ChevronUp size={14} className={`transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mobile Summary Modal Sheet */}
        <AnimatePresence>
          {mobileSummaryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="mt-3 pt-3 border-t border-stone-200 max-h-[75vh] overflow-y-auto"
            >
              <StickyBookingSummary cafeName={cafe.name} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
