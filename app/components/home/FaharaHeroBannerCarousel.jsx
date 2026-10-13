import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Tag, Store, CalendarCheck, Utensils, Coins, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import { FAHARA_LINKS } from '@/app/constants/faharaLinks';

const BANNERS = [
  {
    id: 1,
    badge: "Discover What's New",
    icon: Sparkles,
    badgeBg: 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-md shadow-amber-500/20',
    title: '✨ Fahara Just Got More Exciting',
    subtitle: 'Explore new venues, smarter discovery, and a smoother way to plan your moments.',
    ctaText: 'Explore Now',
    ctaLink: '/customer/cafe',
    bgColor: 'bg-gradient-to-br from-[#2C1810] via-[#4A2C11] to-[#784421]',
    glowColor: 'bg-amber-400/25',
  },
  {
    id: 2,
    badge: 'Table Reservations',
    icon: Utensils,
    badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20',
    title: '🍽️ Choose Your Restaurant',
    subtitle: 'Reserve tables at top-rated restaurants and enjoy seamless table bookings with instant confirmation.',
    ctaText: 'Explore Restaurants',
    ctaLink: '/customer/cafe?type=RESTAURANT',
    bgColor: 'bg-gradient-to-br from-[#331800] via-[#5C2B00] to-[#874100]',
    glowColor: 'bg-amber-500/25',
  },
  {
    id: 3,
    badge: 'Fahara Rewards',
    icon: Coins,
    badgeBg: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white shadow-md shadow-amber-400/20',
    title: '🎁 Claim Your Credit Points on Every Booking',
    subtitle: 'Earn Fahara credit points for every completed venue reservation and redeem them on future bookings.',
    ctaText: 'View Bookings & Points',
    ctaLink: '/customer/bookings',
    bgColor: 'bg-gradient-to-br from-[#2A1800] via-[#4D2B02] to-[#734305]',
    glowColor: 'bg-yellow-400/25',
  },
  {
    id: 4,
    badge: 'Upcoming Discounts & Special Offers',
    icon: Tag,
    badgeBg: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20',
    title: '🔥 Upcoming Discounts & Exclusive Deals',
    subtitle: 'Stay tuned for exciting discounts and special offers from top Fahara venues coming soon.',
    ctaText: 'Browse Offers',
    ctaLink: '/customer/cafe?tab=deals',
    bgColor: 'bg-gradient-to-br from-[#3B091B] via-[#63142F] to-[#991B41]',
    glowColor: 'bg-rose-400/25',
  },
  {
    id: 5,
    badge: 'Cafe Partner',
    icon: Store,
    badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20',
    title: 'Grow Your Venue Business with Fahara',
    subtitle: 'List your cafe or space, receive instant party reservations & maximize revenue.',
    ctaText: 'Become a Cafe Partner',
    ctaLink: FAHARA_LINKS.cafeSignup,
    bgColor: 'bg-gradient-to-br from-[#06241D] via-[#0E473B] to-[#1A6E5C]',
    glowColor: 'bg-emerald-400/25',
  },
  {
    id: 6,
    badge: 'Event Partner',
    icon: CalendarCheck,
    badgeBg: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20',
    title: 'Partner with Fahara as an Event Specialist',
    subtitle: 'Offer your decor, photography, catering, or entertainment services for events.',
    ctaText: 'Become an Event Partner',
    ctaLink: FAHARA_LINKS.eventManagerSignup,
    bgColor: 'bg-gradient-to-br from-[#1B0B33] via-[#35165E] to-[#5D289B]',
    glowColor: 'bg-purple-400/25',
  },
];

export default function FaharaHeroBannerCarousel() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Minimum swipe distance threshold (in px)
  const minSwipeDistance = 40;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!mounted) {
    return (
      <div className="relative w-full mb-5 min-h-[170px] xs:min-h-[185px] sm:min-h-[200px] md:min-h-[220px] overflow-hidden rounded-2xl border border-stone-200/80 bg-[#2C1810] animate-pulse" />
    );
  }

  const currentBanner = BANNERS[currentIndex];

  return (
    <div 
      suppressHydrationWarning
      className="relative w-full mb-5 overflow-hidden rounded-2xl border border-stone-200/80 shadow-md bg-[#2C1810] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full min-h-[175px] xs:min-h-[185px] sm:min-h-[200px] md:min-h-[220px] flex items-center overflow-hidden">
        
        {/* Animated Banner Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0, scale: 0.99, x: 16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.99, x: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`absolute inset-0 w-full h-full ${currentBanner.bgColor || 'bg-[#2C1810]'}`}
          >
            {/* Ambient Decorative Color Layer & Glowing Orbs */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <div className={`absolute -right-12 -top-12 w-80 h-80 rounded-full blur-3xl opacity-50 ${currentBanner.glowColor}`} />
              <div className={`absolute right-1/4 -bottom-16 w-60 h-60 rounded-full blur-2xl opacity-35 ${currentBanner.glowColor}`} />
              <div className="absolute left-6 -bottom-12 w-48 h-48 rounded-full blur-2xl opacity-15 bg-white" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-70" />
            </div>

            {/* Banner Content Container */}
            <div className="relative z-10 h-full w-full max-w-2xl flex flex-col justify-center px-4 sm:px-8 py-3.5 sm:py-5 text-white space-y-2 sm:space-y-2.5 pr-12 sm:pr-16">
              
              {/* Badge */}
              <div className="self-start">
                {(() => {
                  const BadgeIcon = currentBanner.icon || Sparkles;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wide shadow-xs ${currentBanner.badgeBg}`}>
                      <BadgeIcon size={12} className="shrink-0" />
                      <span>{currentBanner.badge}</span>
                    </span>
                  );
                })()}
              </div>

              {/* Title */}
              <h2 className="text-sm xs:text-base sm:text-xl lg:text-2xl font-black leading-snug tracking-tight text-white drop-shadow-md line-clamp-2">
                {currentBanner.title}
              </h2>

              {/* Subtitle */}
              <p className="text-[11px] sm:text-xs text-amber-100/90 font-medium max-w-lg leading-relaxed line-clamp-2 drop-shadow-xs">
                {currentBanner.subtitle}
              </p>

              {/* Interactive CTA Button */}
              {currentBanner.ctaText && currentBanner.ctaLink && (
                <div className="pt-0.5">
                  <Link href={currentBanner.ctaLink}>
                    <button className="group inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95">
                      <span>{currentBanner.ctaText}</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Interactive Left & Right Navigation Arrows (Subtle, sleek, non-intrusive) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Banner"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 hover:scale-105 active:scale-90 shadow-md cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Banner"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 hover:scale-105 active:scale-90 shadow-md cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Pagination Dots & Play/Pause Control (Compact and neatly aligned in the corner) */}
        <div className="absolute bottom-2.5 right-3 sm:right-5 z-20 flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-md">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Play slide transition" : "Pause slide transition"}
            className="text-white/80 hover:text-amber-400 transition-colors mr-0.5 cursor-pointer"
          >
            {isPaused ? <Play className="w-2.5 h-2.5 fill-current" /> : <Pause className="w-2.5 h-2.5 fill-current" />}
          </button>

          <div className="flex items-center gap-1">
            {BANNERS.map((b, idx) => (
              <button
                key={b.id}
                suppressHydrationWarning
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to banner ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-5 bg-amber-400 shadow-xs' : 'w-1.5 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
