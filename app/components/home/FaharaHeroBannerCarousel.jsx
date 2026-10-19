import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Tag, Store, CalendarCheck, Utensils, Coins, Play, Pause } from 'lucide-react';
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
  const timerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Minimum swipe distance threshold (in px)
  const minSwipeDistance = 40;

  // Autoplay interval every 4.5 seconds with proper cleanup
  useEffect(() => {
    if (!mounted || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mounted, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    // Resume autoplay after short delay
    setTimeout(() => setIsPaused(false), 2000);
  };

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
    setIsPaused(true);
    // Resume autoplay after interaction
    setTimeout(() => setIsPaused(false), 3000);
  };

  if (!mounted) {
    return (
      <div className="relative w-full mb-3 min-h-[135px] sm:min-h-[155px] md:min-h-[170px] overflow-hidden rounded-2xl border border-stone-200/80 bg-[#2C1810] animate-pulse" />
    );
  }

  const currentBanner = BANNERS[currentIndex];

  return (
    <div 
      suppressHydrationWarning
      className="relative w-full mb-3 overflow-hidden rounded-2xl border border-stone-200/80 shadow-md bg-[#2C1810] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 20-25% more compact banner container */}
      <div className="relative w-full min-h-[135px] xs:min-h-[145px] sm:min-h-[160px] md:min-h-[175px] flex items-center overflow-hidden">
        
        {/* Animated Banner Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`absolute inset-0 w-full h-full ${currentBanner.bgColor || 'bg-[#2C1810]'}`}
          >
            {/* Ambient Decorative Color Layer & Glowing Orbs */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <div className={`absolute -right-10 -top-10 w-64 h-64 rounded-full blur-3xl opacity-45 ${currentBanner.glowColor}`} />
              <div className={`absolute right-1/4 -bottom-12 w-48 h-48 rounded-full blur-2xl opacity-30 ${currentBanner.glowColor}`} />
              <div className="absolute left-6 -bottom-10 w-36 h-36 rounded-full blur-2xl opacity-15 bg-white" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-70" />
            </div>

            {/* Banner Content Container (Full width without reserved arrow space) */}
            <div className="relative z-10 h-full w-full flex flex-col justify-center px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-white space-y-1.5 sm:space-y-2">
              
              {/* Badge */}
              <div className="self-start">
                {(() => {
                  const BadgeIcon = currentBanner.icon || Sparkles;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black tracking-wide shadow-xs ${currentBanner.badgeBg}`}>
                      <BadgeIcon size={11} className="shrink-0" />
                      <span>{currentBanner.badge}</span>
                    </span>
                  );
                })()}
              </div>

              {/* Title */}
              <h2 className="text-xs xs:text-sm sm:text-lg lg:text-xl font-black leading-snug tracking-tight text-white drop-shadow-md line-clamp-1 sm:line-clamp-2 max-w-[85%] sm:max-w-[75%]">
                {currentBanner.title}
              </h2>

              {/* Subtitle */}
              <p className="text-[10px] sm:text-xs text-amber-100/90 font-medium max-w-[88%] sm:max-w-xl leading-tight sm:leading-relaxed line-clamp-1 sm:line-clamp-2 drop-shadow-xs">
                {currentBanner.subtitle}
              </p>

              {/* Bottom Interactive Row: CTA Button + Pagination Dots */}
              <div className="pt-0.5 flex items-center justify-between gap-3">
                {currentBanner.ctaText && currentBanner.ctaLink ? (
                  <Link href={currentBanner.ctaLink} onClick={(e) => e.stopPropagation()}>
                    <button 
                      type="button"
                      className="group inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                    >
                      <span>{currentBanner.ctaText}</span>
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                ) : <div />}

                {/* Pagination Dots & Play/Pause Control (Compact, clean & aligned) */}
                <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/20 shadow-sm shrink-0">
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
                        type="button"
                        suppressHydrationWarning
                        onClick={() => goToSlide(idx)}
                        aria-label={`Go to banner ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          currentIndex === idx ? 'w-4 sm:w-5 bg-amber-400 shadow-xs' : 'w-1.5 bg-white/40 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
