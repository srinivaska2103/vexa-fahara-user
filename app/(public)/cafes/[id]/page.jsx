'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCafeDetails, useCafeReviews } from '@/hooks/useCafeDetails';
import { Loader2, ArrowLeft, ArrowRight, ShieldCheck, ChevronLeft, ChevronRight, Sparkles, Layers } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCafeDetailsStore } from '@/stores/cafeDetails.store';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import CafeHero from '@/app/components/cafe-details/CafeHero';
import CafeGallery from '@/app/components/cafe-details/CafeGallery';
import GalleryLightbox from '@/app/components/cafe-details/GalleryLightbox';
import CafeInfo from '@/app/components/cafe-details/CafeInfo';
import AmenitiesSection from '@/app/components/cafe-details/AmenitiesSection';
import BusinessHours from '@/app/components/cafe-details/BusinessHours';
import AvailableEvents from '@/app/components/cafe-details/AvailableEvents';
import ReviewList from '@/app/components/cafe-details/ReviewList';
import LocationSection from '@/app/components/cafe-details/LocationSection';
import StickyBookingCard from '@/app/components/cafe-details/StickyBookingCard';
import FilterSidebar from '@/app/components/cafes/FilterSidebar';
import SimilarCafes from '@/app/components/cafe-details/SimilarCafes';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';

export default function CafeDetailsPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId.join('') : rawId;
  const router = useRouter();
  const { t } = useLanguage();

  const [activeStepTab, setActiveStepTab] = useState('photos');

  const { data: cafeResponse, isLoading, error } = useCafeDetails(id);
  const { data: reviewsResponse } = useCafeReviews(id);
  
  const cafe = cafeResponse?.data;
  const reviews = reviewsResponse?.data?.reviews || [];

  // Combine images for lightbox modal from real data
  const rawGallery = cafe?.gallery || [];
  const galleryArray = Array.isArray(rawGallery) ? rawGallery : [];
  const coverImg = cafe?.cover_image || cafe?.coverImage || cafe?.image;
  const lightboxImages = [coverImg, ...galleryArray].filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] p-4">
        <FaharaInteractiveLoader message="Loading Cafe Details & Venue Photos..." />
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] p-4 text-center">
        <h2 className="text-2xl font-black text-[#2C1810] mb-2">Cafe Not Found</h2>
        <p className="text-stone-500 text-sm mb-6 max-w-md">We couldn&apos;t load the requested cafe details. It may have been moved or removed.</p>
        <button 
          onClick={() => router.push('/customer/cafe')} 
          className="px-6 py-3 bg-[#6F4E37] text-white font-bold rounded-2xl shadow-md hover:bg-[#4A2C11] transition-all"
        >
          Return to Discovery
        </button>
      </div>
    );
  }

  const stepsList = [
    { id: 'photos', step: '01', label: 'Photos & Gallery' },
    { id: 'info', step: '02', label: 'Space Details' },
    { id: 'amenities', step: '03', label: 'Amenities' },
    { id: 'hours', step: '04', label: 'Business Hours' },
    { id: 'packages', step: '05', label: 'Event Packages' },
    { id: 'location', step: '06', label: 'Location & Map' },
    { id: 'reviews', step: '07', label: 'Reviews & Ratings' }
  ];

  const currentStepIndex = stepsList.findIndex(s => s.id === activeStepTab);

  const goToNextStep = () => {
    if (currentStepIndex < stepsList.length - 1) {
      setActiveStepTab(stepsList[currentStepIndex + 1].id);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setActiveStepTab(stepsList[currentStepIndex - 1].id);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-36 lg:pb-12">
      
      {/* Lightbox Modal */}
      <GalleryLightbox images={lightboxImages} />

      {/* Top Navbar with Search Bar */}
      <CustomerNavbar showSearch={true} showViewToggles={false} />

      {/* Main Responsive Container */}
      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 max-w-7xl overflow-x-hidden">
        
        {/* Back Button Navigation Row */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <Link href="/customer/cafe" className="inline-flex items-center text-xs font-extrabold bg-white hover:bg-[#FFF8F0] hover:text-[#6F4E37] text-stone-700 px-3.5 py-2 rounded-2xl border border-stone-200/80 transition-all shadow-2xs">
            <ArrowLeft size={14} className="mr-1.5" /> Back to cafes
          </Link>

          <span className="text-[10px] sm:text-xs font-black text-[#6F4E37] bg-[#FFF8F0] border border-[#DDB892]/60 px-3 py-1.5 rounded-full shadow-2xs">
            Step {currentStepIndex + 1} of {stepsList.length}
          </span>
        </div>

        {/* STEP-BY-STEP SECTION NAVIGATION BAR */}
        <div className="relative md:sticky md:top-[4.5rem] z-30 mb-4 bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl sm:rounded-full p-1 sm:p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] overflow-x-auto scrollbar-none w-full">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-max px-0.5">
            {stepsList.map((item) => {
              const isActive = activeStepTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveStepTab(item.id);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-black transition-all duration-300 cursor-pointer shrink-0 active:scale-95 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-md shadow-[#4A2C11]/25' 
                      : 'bg-stone-50/90 hover:bg-[#FFF8F0] hover:text-[#6F4E37] text-stone-700 border border-stone-200/60 font-bold'
                  }`}
                >
                  <span className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-black text-[9px] sm:text-[10px] transition-colors ${
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

        {/* ALWAYS SHOW HERO TITLE & RATING ON TOP */}
        <CafeHero cafe={cafe} />

        {/* DYNAMIC STEP CONTENT LAYOUT - ZERO SPACE & NO BLANK GAPS */}
        <div className="flex flex-col lg:flex-row gap-6 relative items-start w-full">
          
          {/* Left Main Content Column */}
          <div className="lg:w-2/3 min-w-0 w-full space-y-4 sm:space-y-6">
            
            <AnimatePresence mode="wait">
              
              {/* STEP 01: PHOTOS & GALLERY */}
              {activeStepTab === 'photos' && (
                <motion.div
                  key="step-photos"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <CafeGallery cafe={cafe} />
                </motion.div>
              )}

              {/* STEP 02: SPACE DETAILS */}
              {activeStepTab === 'info' && (
                <motion.div
                  key="step-info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <CafeInfo cafe={cafe} />
                </motion.div>
              )}

              {/* STEP 03: AMENITIES */}
              {activeStepTab === 'amenities' && (
                <motion.div
                  key="step-amenities"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <AmenitiesSection cafe={cafe} />
                </motion.div>
              )}

              {/* STEP 04: BUSINESS HOURS */}
              {activeStepTab === 'hours' && (
                <motion.div
                  key="step-hours"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <BusinessHours cafe={cafe} />
                </motion.div>
              )}

              {/* STEP 05: EVENT PACKAGES */}
              {activeStepTab === 'packages' && (
                <motion.div
                  key="step-packages"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <AvailableEvents cafe={cafe} />
                </motion.div>
              )}

              {/* STEP 06: LOCATION & MAP */}
              {activeStepTab === 'location' && (
                <motion.div
                  key="step-location"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <LocationSection cafe={cafe} />
                </motion.div>
              )}

              {/* STEP 07: REVIEWS & RATINGS */}
              {activeStepTab === 'reviews' && (
                <motion.div
                  key="step-reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <ReviewList reviews={reviews} cafe={cafe} />
                </motion.div>
              )}

            </AnimatePresence>

            {/* STEP-BY-STEP STEPPER FOOTER BUTTONS */}
            <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
              <button
                disabled={currentStepIndex <= 0}
                onClick={goToPrevStep}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentStepIndex <= 0
                    ? 'bg-stone-100 text-stone-300 border border-stone-200/40 cursor-not-allowed'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] shadow-2xs'
                }`}
              >
                <ChevronLeft size={16} />
                <span>Previous Step</span>
              </button>

              <div className="text-center hidden xs:block">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">ACTIVE STEP</span>
                <span className="text-xs font-black text-[#6F4E37]">{stepsList[currentStepIndex]?.label}</span>
              </div>

              <button
                disabled={currentStepIndex >= stepsList.length - 1}
                onClick={goToNextStep}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentStepIndex >= stepsList.length - 1
                    ? 'bg-stone-100 text-stone-300 border border-stone-200/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-md hover:shadow-lg'
                }`}
              >
                <span>Next Step</span>
                <ChevronRight size={16} />
              </button>
            </div>

          </div>

          {/* Right Column: Desktop Sticky Booking Card */}
          <div className="hidden lg:block lg:w-1/3 sticky top-24">
            <StickyBookingCard cafe={cafe} />
          </div>

        </div>

        {/* Similar Cafes Section */}
        <div className="mt-8">
          <SimilarCafes cafe={cafe} />
        </div>

      </main>

      {/* Mobile Fixed Floating Booking Bar (< lg screens) */}
      <div className="lg:hidden fixed bottom-[5.5rem] sm:bottom-[5.8rem] left-3 right-3 z-40 select-none">
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl p-3 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3">
          <div>
            <div className="text-lg sm:text-xl font-black text-[#2C1810] leading-none">
              ₹{cafe?.price_per_hour || 499} <span className="font-bold text-xs text-stone-400">/ hour</span>
            </div>
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1 mt-1">
              <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
              <span>Instant Confirmation</span>
            </span>
          </div>

          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/booking/${cafe?.id || 1}`)}
            className="bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Book Now</span>
            <ArrowRight size={15} />
          </motion.button>
        </div>
      </div>

    </div>
  );
}
