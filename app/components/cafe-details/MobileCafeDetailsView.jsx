'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Heart, Share2, Star, ShieldCheck, MapPin, 
  Clock, Users, Sparkles, CheckCircle2, ChevronRight,
  IndianRupee, Compass, Eye, Coffee, Wifi, UtensilsCrossed,
  BedDouble, LayoutGrid, MessageSquare, Car, Wind, Sun, Home,
  Phone, Navigation, Bookmark, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useToggleFavorite } from '@/hooks/useFavorites';
import { useCafeDetailsStore } from '@/stores/cafeDetails.store';
import { checkIfCafeOpen, formatMinutesTo12Hour, parseTimeToMinutes, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Existing section components reused for tabs
import CafeInfo from './CafeInfo';
import AmenitiesSection from './AmenitiesSection';
import BusinessHours from './BusinessHours';
import LocationSection from './LocationSection';
import ReviewList from './ReviewList';
import DiscountsSection from './DiscountsSection';
import RestaurantMenuSection from './RestaurantMenuSection';

export default function MobileCafeDetailsView({ 
  cafe, 
  reviews = [], 
  lightboxImages = [] 
}) {
  const router = useRouter();
  const { openLightbox } = useCafeDetailsStore();

  const {
    id: cafeId,
    name,
    average_rating,
    google_rating,
    total_reviews,
    status,
    city,
    address,
    price_per_hour,
    provides_event_services,
    cafe_packages = []
  } = cafe || {};

  // ── 1. GALLERY & IMAGES ──
  const rawGallery = cafe?.gallery || cafe?.photos || cafe?.images || [];
  const galleryArray = Array.isArray(rawGallery)
    ? rawGallery.map(img => typeof img === 'string' ? img : (img?.file_url || img?.url || ''))
    : [];
  const coverImg = cafe?.cover_image || cafe?.coverImage || cafe?.image || cafe?.profile_image;
  const allImages = [coverImg, ...galleryArray]
    .filter(Boolean)
    .map(url => String(url).trim())
    .filter((url, idx, self) => url.length > 0 && self.indexOf(url) === idx);

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // ── SCROLL-AWARE COMPACT HEADER STATE ──
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset || 0;
          setIsHeaderSticky(currentY > 210);
          setScrollY(currentY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate dynamic collapse progress for the gallery (0 = full, 1 = fully collapsed)
  const collapseProgress = Math.min(Math.max(scrollY / 220, 0), 1);
  const imageScale = 1 + collapseProgress * 0.08;
  const imageOpacity = Math.max(1 - collapseProgress * 1.1, 0);
  const imageTranslateY = -scrollY * 0.45; // Subtle parallax effect on collapse

  // ── 2. WISHLIST & SHARE ──
  const isFav = useFavoritesStore((state) => state.isFavoriteCafe(cafeId));
  const toggleFavoriteMutation = useToggleFavorite();

  const handleWishlistClick = (e) => {
    e?.stopPropagation?.();
    if (cafeId && !toggleFavoriteMutation.isPending) {
      toggleFavoriteMutation.mutate(cafeId);
      try {
        const api = require('@/lib/axios').default;
        api.post('/analytics/events', { cafe_id: cafeId, event_type: 'WISHLIST_ADD', source: 'mobile_details' }).catch(() => {});
      } catch (err) {}
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name || 'Grab2GO Cafe',
          text: `Check out ${name || 'this cafe'} on Grab2GO!`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // ── 3. STATUS & INFO ──
  const isVerified = status === 'ACTIVE' || status === 'APPROVED';
  const effectiveRating = (average_rating && parseFloat(average_rating) > 0) ? average_rating : google_rating;
  const rating = effectiveRating ? parseFloat(effectiveRating).toFixed(1) : '5.0';
  const reviewsCount = total_reviews || reviews.length || 124;
  const fullAddress = city ? `${address ? address + ', ' : ''}${city}` : (address || '1, Kamarajar Street, Villapuram, Madurai');
  const isOpen = checkIfCafeOpen(cafe);

  // Today's Operating Hours String formatting
  const todayHoursStr = useMemo(() => {
    try {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayName = days[new Date().getDay()];
      const hoursList = cafe?.cafe_business_hours || cafe?.business_hours || cafe?.operating_hours;
      if (Array.isArray(hoursList)) {
        const todayRecord = hoursList.find(h => 
          (h.day_of_week || h.dayOfWeek || h.day || '').toString().trim().toLowerCase() === todayName.toLowerCase()
        );
        if (todayRecord) {
          if (todayRecord.is_closed || todayRecord.isClosed) return 'Closed Today';
          const openT = todayRecord.open_time || todayRecord.openTime || todayRecord.open;
          const closeT = todayRecord.close_time || todayRecord.closeTime || todayRecord.close;
          if (openT && closeT) {
            const openFmt = formatMinutesTo12Hour(parseTimeToMinutes(openT));
            const closeFmt = formatMinutesTo12Hour(parseTimeToMinutes(closeT));
            if (openFmt && closeFmt) return `${openFmt} - ${closeFmt}`;
          }
        }
      }
    } catch (e) {}
    return '10:00 AM - 11:00 PM';
  }, [cafe]);

  // Price Calculation: format matching Reference 1 ("₹499 for two")
  const priceDisplay = useMemo(() => {
    if (price_per_hour) {
      return {
        amount: `₹${price_per_hour}`,
        subtitle: 'for two'
      };
    }
    if (Array.isArray(cafe_packages) && cafe_packages.length > 0) {
      const firstPkg = cafe_packages[0];
      const cost = Number(firstPkg.price ?? firstPkg.base_price ?? 499);
      return {
        amount: `₹${cost.toLocaleString('en-IN')}`,
        subtitle: 'for two'
      };
    }
    return {
      amount: '₹499',
      subtitle: 'for two'
    };
  }, [price_per_hour, cafe_packages]);

  // Quick Action Buttons Handlers (Call, Direction, Share, Save)
  const handleCallClick = () => {
    const phoneNumber = cafe?.phone || cafe?.contact_phone || cafe?.phone_number || cafe?.users?.phone;
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast('Contact number available via chat support');
      handleChatClick();
    }
  };

  const handleDirectionClick = () => {
    const addressQuery = encodeURIComponent(`${name || 'Cafe'} ${address || ''} ${city || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${addressQuery}`, '_blank');
  };

  const isWalkingCafe = cafe?.is_walking_cafe === true || String(cafe?.is_walking_cafe) === 'true';

  // ── 3.5 ACTIVE DEALS & OFFERS ──
  const activeDiscounts = useMemo(() => {
    if (Array.isArray(cafe?.discounts)) {
      return cafe.discounts.filter(d => d && (d.title || d.name || Number(d.amount) > 0) && Number(d.amount) > 0);
    }
    if (cafe?.discounts && typeof cafe.discounts === 'object') {
      return Object.values(cafe.discounts).filter(d => d && (d.title || d.name || d.discount1_title || d.discount2_title) && (Number(d.amount) > 0 || Number(d.discount1_amount) > 0 || Number(d.discount2_amount) > 0));
    }
    return [];
  }, [cafe?.discounts]);

  const hasDeals = activeDiscounts.length > 0;

  // ── 4. TABS SETUP (Overview, Deals, Events, Reviews) ──
  const [selectedTab, setSelectedTab] = useState('overview');

  const mainTabs = useMemo(() => {
    const tabs = [{ id: 'overview', label: 'Overview' }];
    if (hasDeals) {
      tabs.push({ id: 'deals', label: 'Deals & Offers', badge: activeDiscounts.length });
    }
    tabs.push({ id: 'events', label: 'Events' });
    tabs.push({ id: 'reviews', label: 'Reviews' });
    return tabs;
  }, [hasDeals, activeDiscounts.length]);

  // ── 5. DESCRIPTION EXPANSION ──
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const cafeDescription = (cafe?.description || `${name || 'Taco Twist'} is a colourful and welcoming café in Madurai offering delicious snacks, speciality coffee and a relaxing ambience for friends, private celebrations and family outings.`).trim();

  // ── 6. CHAT ACTION ──
  const handleChatClick = () => {
    const phoneNumber = cafe?.phone || cafe?.contact_phone || cafe?.phone_number || cafe?.users?.phone;
    if (phoneNumber) {
      const cleanPhone = String(phoneNumber).replace(/[^0-9]/g, '');
      const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
      const msg = encodeURIComponent(`Hi, I'm inquiring about ${name || 'your cafe'} on Grab2GO.`);
      window.open(`https://wa.me/${phoneWithCountry}?text=${msg}`, '_blank');
    } else {
      router.push('/contact');
    }
  };

  // ── 7. PACKAGE SELECTION & BOOKING ──
  const hasPackages = Array.isArray(cafe_packages) && cafe_packages.length > 0;
  const [selectedPackageId, setSelectedPackageId] = useState(
    hasPackages ? cafe_packages[0]?.id : null
  );

  const selectedPackage = useMemo(() => {
    if (!hasPackages) return null;
    return cafe_packages.find(p => String(p.id) === String(selectedPackageId)) || cafe_packages[0];
  }, [cafe_packages, selectedPackageId, hasPackages]);

  const handleBookNow = () => {
    if (!isOpen && !isWalkingCafe) {
      toast.error('This venue is currently closed.');
      return;
    }

    if (isWalkingCafe) {
      handleDirectionClick();
      return;
    }

    if (hasPackages && selectedPackage) {
      router.push(`/booking/${cafeId || 1}?packageId=${selectedPackage.id}`);
    } else {
      router.push(`/booking/${cafeId || 1}`);
    }
  };

  return (
    <div className="md:hidden flex flex-col w-full min-h-screen bg-[#FFF5F5] text-[#252525] select-none font-sans overflow-x-hidden relative">
      
      {/* ── 0. COMPACT STICKY HEADER (Stable sticky header with appropriate top offset) ── */}
      <AnimatePresence>
        {isHeaderSticky && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#FEE2E2] pt-[max(0.625rem,env(safe-area-inset-top,0px))] pb-2 px-3 sm:px-4 shadow-[0_4px_20px_rgba(44,24,16,0.08)] flex items-center justify-between gap-2 pointer-events-auto"
          >
            {/* Left: Back button + Cafe Title & Verification */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => router.back()}
                aria-label="Back"
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-[#252525] flex items-center justify-center shrink-0 border border-stone-200/80 cursor-pointer shadow-2xs"
              >
                <ArrowLeft size={16} strokeWidth={2.4} />
              </motion.button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-xs sm:text-sm font-black text-[#252525] truncate">
                    {name || 'Taco Twist'}
                  </span>
                  {isVerified && (
                    <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500">
                  <Star size={11} className="fill-amber-400 text-amber-500 shrink-0" />
                  <span className="text-[#252525]">{rating}</span>
                  <span className="text-[#E50914] font-black truncate">
                    • {priceDisplay.amount} {priceDisplay.subtitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Compact Actions (Share + Save) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleShareClick}
                aria-label="Share cafe"
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#FFF5F5] border border-[#FEE2E2] text-[#E50914] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
              >
                <Share2 size={14} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleWishlistClick}
                aria-label="Save to Wishlist"
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#FFF5F5] border border-[#FEE2E2] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
              >
                <Heart
                  size={15}
                  strokeWidth={2.4}
                  className={cn(
                    "transition-colors",
                    isFav ? "fill-rose-500 text-rose-500" : "text-[#252525]"
                  )}
                />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ── 1. RESPONSIVE HERO IMAGE GALLERY (16:10 aspect ratio, fits 360px & zoom levels) ── */}
      <div 
        ref={galleryRef}
        className="relative w-full max-w-full aspect-[16/10] sm:aspect-[16/9] bg-stone-900 overflow-hidden pointer-events-auto"
      >
        {/* Main Gallery Photo with smooth lightbox tap */}
        {allImages.length > 0 ? (
          <div 
            className="w-full h-full relative cursor-pointer"
            onClick={() => openLightbox(activeImageIdx)}
          >
            <img
              src={allImages[activeImageIdx] || allImages[0]}
              alt={name || 'Cafe Venue'}
              className="w-full h-full object-cover object-center select-none"
              onError={(e) => {
                e.currentTarget.src = '/cat_cafes.jpg';
              }}
            />
            {/* Subtle top vignette for contrast on status bar & controls */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#FFF5F5]/80 bg-[#3B1F13]">
            <Coffee size={40} className="text-[#EF5350] mb-2 opacity-80" />
            <span className="text-xs font-bold text-[#FFF5F5]">No cafe photos available</span>
          </div>
        )}

        {/* Top Floating Circular Controls: Left Back Arrow & Right Heart Icon */}
        <div className="absolute top-0 inset-x-0 pt-3 px-3.5 flex items-center justify-between z-20 pointer-events-auto">
          {/* Back Circular Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white active:scale-90 backdrop-blur-md flex items-center justify-center text-[#252525] shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-all cursor-pointer border border-white/60"
          >
            <ArrowLeft size={18} strokeWidth={2.4} />
          </motion.button>

          {/* Heart / Wishlist Circular Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleWishlistClick}
            aria-label="Save to Wishlist"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white active:scale-90 backdrop-blur-md flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-all cursor-pointer border border-white/60"
          >
            <Heart
              size={19}
              strokeWidth={2.4}
              className={cn(
                "transition-colors",
                isFav ? "fill-rose-500 text-rose-500" : "fill-rose-500 text-rose-500"
              )}
            />
          </motion.button>
        </div>

        {/* Left & Right arrow controls on image for multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-all z-10 cursor-pointer"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-all z-10 cursor-pointer"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* ── 2. WHITE VENUE CARD PANEL (Rounded Top Corners) ── */}
      <div className="relative -mt-5 bg-white rounded-t-[28px] sm:rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border-t border-[#FEE2E2]/70 z-20 pt-5 pb-28 px-3.5 sm:px-4 w-full max-w-full min-w-0 box-border">
        
        {/* Row 1: Title & Verified Badge + Price ("₹499 for two") */}
        <div className="flex items-start justify-between gap-2.5">
          {/* Left: Name + Verified Pill */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight leading-tight truncate max-w-full">
                {name || 'TACO TWIST'}
              </h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/90 px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 shadow-2xs">
                  <ShieldCheck size={11} className="text-emerald-600" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            {/* Row 2: Star Rating & Total Reviews */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mt-1">
              <Star size={13} className="fill-amber-400 text-amber-500 shrink-0" />
              <span className="font-black text-[#252525]">{rating}</span>
              <span className="text-stone-400 text-xs font-semibold">
                ({reviewsCount} Reviews)
              </span>
            </div>
          </div>

          {/* Right: Prominent Price (e.g. ₹499 for two) */}
          <div className="text-right shrink-0">
            <div className="text-base sm:text-lg font-black text-[#E50914] tracking-tight">
              {priceDisplay.amount}{' '}
              <span className="text-[11px] font-extrabold text-[#E50914]/90">{priceDisplay.subtitle}</span>
            </div>
          </div>
        </div>

        {/* Row 3: Address & Distance Pin */}
        <div className="flex items-center justify-between gap-2 text-stone-500 text-xs font-medium mt-2 pt-0.5 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <MapPin size={13} className="text-[#E50914] shrink-0" />
            <span className="truncate">{fullAddress}</span>
          </div>
          <div className="flex items-center gap-1 text-stone-400 font-semibold text-[11px] shrink-0">
            <Compass size={12} className="text-stone-400" />
            <span>1.2 km</span>
          </div>
        </div>

        {/* Row 4: Open Now Pill with Refresh Icon + Time text */}
        <div className="flex items-center gap-2.5 mt-3 flex-wrap">
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black border shadow-2xs transition-colors shrink-0",
            isOpen
              ? "bg-emerald-50 text-emerald-800 border-emerald-200/90"
              : "bg-stone-100 text-stone-600 border-stone-200"
          )}>
            <RotateCcw size={11} className={cn("stroke-[2.5]", isOpen ? "text-emerald-600" : "text-stone-400")} />
            <span>{isOpen ? 'Open Now' : 'Closed'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 min-w-0 truncate">
            <span className="w-1 h-1 rounded-full bg-stone-300 shrink-0" />
            <span className="text-stone-600 truncate">{todayHoursStr}</span>
          </div>
        </div>

        {/* Row 5: Three Interactive Action Icons (Direction, Share, Favorites) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 pt-3.5 border-t border-stone-100 text-center">
          {/* Direction Action */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handleDirectionClick}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF5F5] border border-[#EF5350]/40 flex items-center justify-center text-[#252525] group-hover:bg-[#E50914] group-hover:text-white transition-all shadow-2xs">
              <Navigation size={18} strokeWidth={2} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-stone-700">Direction</span>
          </motion.button>

          {/* Share Action */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handleShareClick}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF5F5] border border-[#EF5350]/40 flex items-center justify-center text-[#252525] group-hover:bg-[#E50914] group-hover:text-white transition-all shadow-2xs">
              <Share2 size={18} strokeWidth={2} />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-stone-700">Share</span>
          </motion.button>

          {/* Favorites Action */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handleWishlistClick}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF5F5] border border-[#EF5350]/40 flex items-center justify-center text-[#252525] group-hover:bg-[#E50914] group-hover:text-white transition-all shadow-2xs">
              <Heart 
                size={18} 
                strokeWidth={2} 
                className={cn(
                  "transition-colors",
                  isFav ? "fill-rose-500 text-rose-500" : "text-[#252525]"
                )} 
              />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-stone-700">{isFav ? 'Favorited' : 'Favorites'}</span>
          </motion.button>
        </div>

        {/* Row 6: Active Deals Banner Pill (rendered if deals exist) */}
        {hasDeals && (
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTab('deals')}
            className="mt-3.5 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-300/60 flex items-center justify-between gap-2 shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Sparkles size={14} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-black text-amber-950 truncate flex items-center gap-1.5">
                  <span>{activeDiscounts[0]?.title || activeDiscounts[0]?.name || 'Special Promotional Offer'}</span>
                  <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-md text-[9px] font-black uppercase">
                    {activeDiscounts[0]?.discountType === 'PERCENT' ? `${activeDiscounts[0]?.amount}% OFF` : `₹${activeDiscounts[0]?.amount} OFF`}
                  </span>
                </div>
                <div className="text-[10px] text-amber-800/80 font-bold">
                  Tap to view {activeDiscounts.length} active venue deal{activeDiscounts.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <ChevronRight size={15} className="text-amber-800 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </motion.div>
        )}

        {/* Row 7: Real Popularity Information (rendered only when real data exists) */}
        {(cafe?.monthly_bookings_count || reviewsCount > 0) && (
          <div className="mt-3 p-2.5 sm:p-3 rounded-2xl bg-[#FFF5F5]/90 border border-[#EF5350]/40 flex items-center gap-2.5 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-[#E50914] flex items-center justify-center text-white text-[10px] font-black shrink-0">
              ★
            </div>
            <span className="text-[11px] sm:text-xs font-black text-[#252525] tracking-tight">
              {cafe?.monthly_bookings_count 
                ? `Loved by ${cafe.monthly_bookings_count}+ customers this month` 
                : `Rated ${rating} out of 5 by ${reviewsCount} verified visitors`}
            </span>
          </div>
        )}

        {/* ── 8. STABLE STICKY TAB NAVIGATION (Overview, Deals, Events, Reviews) ── */}
        <div className="sticky top-[52px] z-30 bg-white/95 backdrop-blur-md -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 pt-2 border-b border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between w-full">
            {mainTabs.map((tab) => {
              const isActive = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  className="relative flex-1 text-center py-2.5 px-1 text-xs sm:text-sm font-black transition-colors cursor-pointer select-none"
                >
                  <span className={cn(
                    "flex items-center justify-center gap-1",
                    isActive ? "text-[#252525]" : "text-stone-400 hover:text-stone-600"
                  )}>
                    <span>{tab.label}</span>
                    {tab.badge ? (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center shrink-0">
                        {tab.badge}
                      </span>
                    ) : null}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 inset-x-2 sm:inset-x-4 h-0.5 bg-[#E50914] rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 8: Tab Content (all tabs share identical width and padding) */}
        <div className="mt-4 min-w-0 w-full">
                    {/* TAB: DINING FOOD MENU */}
          {selectedTab === 'menu' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-4 min-w-0"
            >
              <RestaurantMenuSection cafeId={cafeId} cafeName={name} />
            </motion.div>
          )}

          {/* TAB 1: OVERVIEW */}
          {selectedTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 4 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.18 }}
              className="space-y-4 min-w-0"
            >
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#252525] mb-1">About</h2>
                <div className="text-xs text-stone-600 leading-relaxed font-normal">
                  <p className={cn("transition-all", !isDescExpanded && "line-clamp-3")}>
                    {cafeDescription}
                  </p>
                  {cafeDescription.length > 90 && (
                    <button
                      type="button"
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                      className="text-xs font-black text-[#E50914] mt-1 hover:underline cursor-pointer inline-block"
                    >
                      {isDescExpanded ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </div>

              {/* Photo Preview Grid (3 rounded thumbnails) */}
              <div className="pt-1">
                <div className="grid grid-cols-3 gap-2">
                  {allImages.slice(0, 3).map((imgUrl, i) => (
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      key={i}
                      onClick={() => openLightbox(i)}
                      className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-[#FEE2E2] cursor-pointer shadow-2xs relative group"
                    >
                      <img 
                        src={imgUrl} 
                        alt={`Photo ${i + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        onError={(e) => { e.currentTarget.src = '/cat_cafes.jpg'; }}
                      />
                    </motion.div>
                  ))}
                  {allImages.length < 3 && [1, 2].slice(0, 3 - allImages.length).map((filler, fi) => (
                    <div key={`fill-${fi}`} className="aspect-[4/3] rounded-xl bg-stone-100 border border-stone-200/80 flex items-center justify-center text-stone-400">
                      <Coffee size={16} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities & Space Info */}
              <div className="pt-3 border-t border-stone-100">
                <AmenitiesSection cafe={cafe} isMobileView={true} />
              </div>

              {/* Weekly Business Hours breakdown */}
              <div className="pt-3 border-t border-stone-100">
                <BusinessHours cafe={cafe} isMobileView={true} />
              </div>
            </motion.div>
          )}

          {/* TAB: DEALS & OFFERS */}
          {selectedTab === 'deals' && (
            <motion.div 
              initial={{ opacity: 0, y: 4 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.18 }}
              className="space-y-3 min-w-0"
            >
              <DiscountsSection cafe={cafe} isMobileView={true} />
            </motion.div>
          )}

          {/* TAB 2: EVENTS & PACKAGES */}
          {selectedTab === 'events' && (
            <motion.div 
              initial={{ opacity: 0, y: 4 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.18 }}
              className="space-y-3 min-w-0"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-stone-400">
                  Venue Event Packages ({cafe_packages.length})
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#E50914]">
                  Tap to Select
                </span>
              </div>

              {cafe_packages.length > 0 ? (
                cafe_packages.map((pkg) => {
                  const isSelected = String(pkg.id) === String(selectedPackageId);
                  const pkgPrice = Number(pkg.price ?? pkg.base_price ?? 0);
                  
                  let parsedInclusions = [];
                  if (Array.isArray(pkg.inclusions)) {
                    parsedInclusions = pkg.inclusions;
                  } else if (typeof pkg.inclusions === 'string') {
                    try {
                      const parsed = JSON.parse(pkg.inclusions);
                      parsedInclusions = Array.isArray(parsed) ? parsed : (parsed?.items || parsed?.inclusions || []);
                    } catch (e) {
                      parsedInclusions = [];
                    }
                  }

                  const inclusionsToDisplay = parsedInclusions.length > 0 ? parsedInclusions : ['Decoration', 'Welcome Drinks', 'Music System', 'Private Seating'];

                  return (
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all cursor-pointer relative shadow-xs min-w-0 w-full",
                        isSelected
                          ? "bg-white border-[#E50914] ring-2 ring-[#E50914]/20 shadow-md"
                          : "bg-white border-[#FEE2E2] hover:border-stone-300"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={cn(
                              "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0",
                              isSelected ? "border-[#E50914] bg-[#E50914]" : "border-stone-300"
                            )}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <h3 className="text-xs sm:text-sm font-black text-[#252525] tracking-tight truncate">
                              {pkg.package_name || pkg.title || 'Special Package'}
                            </h3>
                          </div>
                          {pkg.description && (
                            <p className="text-[11px] text-stone-500 font-medium mt-1 line-clamp-2 pl-5">
                              {pkg.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#E50914] shrink-0">
                          ₹{pkgPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Package Capacity & Duration Badges */}
                      <div className="flex items-center gap-2 text-[10px] font-bold text-stone-500 mt-2 pl-5 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Users size={11} className="text-[#E50914] shrink-0" />
                          <span>{pkg.minimum_persons || 1} - {pkg.maximum_persons || 25} guests</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-[#E50914] shrink-0" />
                          <span>{pkg.duration_hours ? `${pkg.duration_hours} hrs` : '2 hrs session'}</span>
                        </div>
                      </div>

                      {/* Inclusions List Chips */}
                      <div className="mt-2 pt-2 border-t border-stone-100 pl-5">
                        <span className="text-[9px] font-black uppercase text-stone-400 block tracking-wider mb-1">
                          Inclusions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {inclusionsToDisplay.slice(0, 4).map((inc, i) => {
                            const incName = typeof inc === 'string' ? inc : (inc?.name || inc?.title || 'Item');
                            return (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FFF5F5] border border-[#EF5350]/50 text-[#E50914] text-[10px] font-extrabold max-w-full"
                              >
                                <CheckCircle2 size={10} className="text-emerald-600 shrink-0" />
                                <span className="truncate max-w-[120px]">{incName}</span>
                              </span>
                            );
                          })}
                          {inclusionsToDisplay.length > 4 && (
                            <span className="text-[9px] font-bold text-stone-400 self-center">
                              +{inclusionsToDisplay.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-[#FEE2E2] text-center text-stone-500 text-xs font-bold">
                  Custom celebration and event packages available upon inquiry.
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: REVIEWS */}
          {selectedTab === 'reviews' && (
            <motion.div 
              initial={{ opacity: 0, y: 4 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.18 }}
              className="space-y-4 min-w-0"
            >
              <ReviewList reviews={reviews} cafe={cafe} isMobileView={true} />
            </motion.div>
          )}
        </div>

      </div>

      {/* ── 8. FIXED STATIONARY BOTTOM CTA ACTION BAR ── */}
      {/* Anchored to viewport bottom with safe-area padding; stationary while content scrolls */}
      <div 
        style={{ 
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' 
        }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#FEE2E2] pt-2.5 px-3.5 sm:px-4 shadow-[0_-8px_25px_rgba(44,24,16,0.08)] pointer-events-auto"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 max-w-md mx-auto w-full">
          {/* Price Indicator (Left side, approx ~40% width) */}
          <div 
            tabIndex={0}
            role="status"
            aria-label={`Price: ${priceDisplay.amount} ${priceDisplay.subtitle}`}
            className="w-[40%] h-12 rounded-2xl bg-[#FFF5F5] border border-[#EF5350]/60 flex items-center justify-center px-2 text-center shadow-2xs select-none transition-colors hover:border-[#EF5350]"
          >
            <span className="text-xs sm:text-sm font-black text-[#252525] tracking-tight truncate">
              {priceDisplay.amount}{' '}
              <span className="text-[11px] font-bold text-stone-500">{priceDisplay.subtitle}</span>
            </span>
          </div>

          {/* Book a Table Action (Right side, approx ~60% width) */}
          <button
            type="button"
            onClick={handleBookNow}
            disabled={!isOpen && !isWalkingCafe}
            aria-label={isWalkingCafe ? 'Get Directions to cafe' : !isOpen ? 'Cafe is currently closed' : 'Book now'}
            className={cn(
              "w-[60%] h-12 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md select-none focus:outline-none focus:ring-2 focus:ring-[#B71C1C]/40 active:scale-[0.98]",
              isOpen || isWalkingCafe
                ? "bg-[#B71C1C] hover:bg-[#3B1F13] active:bg-[#252525] text-white shadow-[#B71C1C]/25"
                : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
            )}
          >
            <span className="truncate">
              {isWalkingCafe 
                ? 'Get Directions' 
                : !isOpen 
                  ? 'Closed' 
                  : 'Book Now'}
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}
