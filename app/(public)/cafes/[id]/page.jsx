'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCafeDetails, useCafeReviews } from '@/hooks/useCafeDetails';
import { 
  Loader2, ArrowLeft, ArrowRight, ShieldCheck, ChevronLeft, ChevronRight, Sparkles, Layers,
  Camera, Building2, Flame, Clock, PartyPopper, MapPin, Star
} from 'lucide-react';
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
import DiscountsSection from '@/app/components/cafe-details/DiscountsSection';
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

  const { data: cafeResponse, isLoading, isPending, error } = useCafeDetails(id);
  const { data: reviewsResponse } = useCafeReviews(id);
  
  const cafe = cafeResponse?.data;
  const reviews = reviewsResponse?.data?.reviews || [];

  // Non-blocking analytics view tracking
  useEffect(() => {
    if (id) {
      try {
        const api = require('@/lib/axios').default;
        api.post('/analytics/events', {
          cafe_id: id,
          event_type: 'CAFE_VIEW',
          source: 'website'
        }).catch(() => {});
      } catch (err) {}
    }
  }, [id]);

  // Combine images for lightbox modal from real data
  const rawGallery = cafe?.gallery || [];
  const galleryArray = Array.isArray(rawGallery) ? rawGallery : [];
  const coverImg = cafe?.cover_image || cafe?.coverImage || cafe?.image;
  const lightboxImages = [coverImg, ...galleryArray].filter(Boolean);

  if (isLoading || isPending) {
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

  const categoryVal = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.category_name || ''} ${cafe?.name || ''}`.toString().toLowerCase().trim();
  const isRestaurant = 
    categoryVal.includes('restaur') || 
    categoryVal.includes('restur') ||
    cafe?.role === 'RESTAURANT_OWNER' ||
    cafe?.user_type === 'RESTAURANT_OWNER' ||
    (cafe?.users && (cafe.users.user_type === 'RESTAURANT_OWNER' || cafe.users.role === 'RESTAURANT_OWNER' || cafe.users.roles?.name === 'RESTAURANT_OWNER')) ||
    (cafe?.owner && (cafe.owner.user_type === 'RESTAURANT_OWNER' || cafe.owner.role === 'RESTAURANT_OWNER' || cafe.owner.roles?.name === 'RESTAURANT_OWNER'));

  const hasDiscounts = Array.isArray(cafe?.discounts) && cafe.discounts.some(d => d && (d.title || d.name || Number(d.amount) > 0) && Number(d.amount) > 0);
  const hasObjDiscounts = cafe?.discounts && typeof cafe.discounts === 'object' && !Array.isArray(cafe.discounts) && (Number(cafe.discounts.discount1_amount) > 0 || Number(cafe.discounts.discount2_amount) > 0);
  const hasPkgDiscount = Array.isArray(cafe?.cafe_packages) && cafe.cafe_packages.some(p => Number(p.discount || p.discount_percentage || p.discount_amount) > 0);
  const hasValidDiscounts = hasDiscounts || hasObjDiscounts || hasPkgDiscount;

  const isWalkingCafe = 
    cafe?.is_walking_cafe === true || 
    cafe?.is_walking_cafe === 'true' || 
    (cafe?.users && (cafe.users.user_type === 'WALKING_CAFE_OWNER' || cafe.users.role === 'WALKING_CAFE_OWNER' || cafe.users.roles?.name === 'WALKING_CAFE_OWNER')) ||
    (cafe?.owner && (cafe.owner.user_type === 'WALKING_CAFE_OWNER' || cafe.owner.role === 'WALKING_CAFE_OWNER' || cafe.owner.roles?.name === 'WALKING_CAFE_OWNER')) ||
    categoryVal === 'walking cafe' ||
    categoryVal === 'walking cafes' ||
    (categoryVal.includes('walking') && categoryVal.includes('cafe'));

  const rawSteps = [
    { id: 'photos', label: 'Photos & Gallery', icon: Camera, activeBg: 'from-amber-600 to-orange-600', badgeBg: 'bg-amber-500 text-white', iconColor: 'text-amber-600' },
    { id: 'info', label: 'Space Details', icon: Building2, activeBg: 'from-blue-600 to-indigo-600', badgeBg: 'bg-blue-600 text-white', iconColor: 'text-blue-600' },
    ...(hasValidDiscounts ? [{ id: 'discounts', label: 'Deals & Offers', icon: Flame, activeBg: 'from-amber-500 via-rose-600 to-red-600', badgeBg: 'bg-gradient-to-r from-amber-500 to-rose-600 text-white', iconColor: 'text-rose-500' }] : []),
    { id: 'amenities', label: 'Amenities', icon: Sparkles, activeBg: 'from-emerald-600 to-teal-600', badgeBg: 'bg-emerald-600 text-white', iconColor: 'text-emerald-600' },
    { id: 'hours', label: 'Business Hours', icon: Clock, activeBg: 'from-purple-600 to-violet-600', badgeBg: 'bg-purple-600 text-white', iconColor: 'text-purple-600' },
    ...(!isWalkingCafe && !isRestaurant && (cafe?.event_booking !== false || (Array.isArray(cafe?.cafe_packages) && cafe.cafe_packages.length > 0)) ? [{ id: 'packages', label: 'Event Packages', icon: PartyPopper, activeBg: 'from-pink-600 to-rose-500', badgeBg: 'bg-pink-600 text-white', iconColor: 'text-pink-600' }] : []),
    { id: 'location', label: 'Location & Map', icon: MapPin, activeBg: 'from-cyan-600 to-blue-600', badgeBg: 'bg-[#6F4E37] text-white', iconColor: 'text-[#6F4E37]' },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star, activeBg: 'from-amber-500 to-yellow-600', badgeBg: 'bg-amber-500 text-white', iconColor: 'text-amber-500' }
  ];

  const stepsList = rawSteps.map((step, idx) => ({
    ...step,
    step: (idx + 1).toString().padStart(2, '0')
  }));

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
    <div suppressHydrationWarning className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-36 lg:pb-12">
      
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

        {/* STEP-BY-STEP COLORFUL SECTION NAVIGATION BAR WITH BOTTOM PADDING */}
        <div className="relative md:sticky md:top-[4.5rem] z-30 mb-8 sm:mb-10 bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl sm:rounded-full p-1.5 sm:p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-x-auto scrollbar-none w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max px-1">
            {stepsList.map((item) => {
              const isActive = activeStepTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveStepTab(item.id);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-black transition-all duration-300 cursor-pointer shrink-0 active:scale-95 border ${
                    isActive 
                      ? `bg-gradient-to-r ${item.activeBg} text-white border-white/30 shadow-md` 
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200/80 shadow-2xs'
                  }`}
                >
                  <span className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full flex items-center justify-center font-black text-[9px] sm:text-[10px] shadow-2xs transition-colors ${
                    isActive ? 'bg-white text-[#2C1810]' : item.badgeBg
                  }`}>
                    {item.step}
                  </span>
                  
                  <Icon size={14} className={isActive ? 'text-white' : item.iconColor} />
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

              {/* STEP 03: DEALS & OFFERS */}
              {activeStepTab === 'discounts' && (
                <motion.div
                  key="step-discounts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <DiscountsSection cafe={cafe} />
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

      {/* Mobile Fixed Floating Action Bar (< lg screens) */}
      <div className="lg:hidden fixed bottom-[5.5rem] sm:bottom-[5.8rem] left-3 right-3 z-40 select-none">
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl p-3 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3">
          {isWalkingCafe ? (
            <>
              <div>
                <div className="text-sm font-black text-emerald-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Walking Cafe
                </div>
                <span className="text-[10px] font-bold text-stone-500 block mt-0.5">
                  Walk-in Customers Welcome
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const addressQuery = encodeURIComponent(`${cafe?.name || 'Cafe'} ${cafe?.address || ''} ${cafe?.city || ''}`);
                    window.open(`https://www.google.com/maps/search/?api=1&query=${addressQuery}`, '_blank');
                  }}
                  className="bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <MapPin size={14} />
                  <span>Directions</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {(() => {
                const catStr = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
                const isRestaurant = catStr.includes('restaur') || catStr.includes('restur');
                if (isRestaurant) {
                  return (
                    <div>
                      <div className="text-sm font-black text-[#2C1810] leading-none">
                        Restaurant Table
                      </div>
                      <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1 mt-1">
                        <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
                        <span>Free Table Reservation</span>
                      </span>
                    </div>
                  );
                }
                return (
                  <div>
                    <div className="text-lg sm:text-xl font-black text-[#2C1810] leading-none">
                      ₹{cafe?.price_per_hour || 499} <span className="font-bold text-xs text-stone-400">/ hour</span>
                    </div>
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1 mt-1">
                      <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
                      <span>Instant Confirmation</span>
                    </span>
                  </div>
                );
              })()}

              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/booking/${cafe?.id || 1}`)}
                className="bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Book Now</span>
                <ArrowRight size={15} />
              </motion.button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
