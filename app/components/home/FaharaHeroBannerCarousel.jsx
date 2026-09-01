'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Tag, Store, CalendarCheck } from 'lucide-react';
import Link from 'next/link';

const BANNERS = [
  {
    id: 1,
    badge: "Discover What's New",
    icon: Sparkles,
    badgeBg: 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-md shadow-amber-500/20',
    title: '✨ Fahara Just Got More Exciting',
    subtitle: 'Explore new venues, smarter discovery, and a smoother way to plan your moments.',
    bgColor: 'bg-gradient-to-br from-[#2C1810] via-[#4A2C11] to-[#784421]',
    glowColor: 'bg-amber-400/25',
  },
  {
    id: 2,
    badge: 'Upcoming Discounts & Special Offers',
    icon: Tag,
    badgeBg: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20',
    title: '🔥 Upcoming Discounts & Exclusive Deals',
    subtitle: 'Stay tuned for exciting discounts and special offers from top Fahara venues coming soon.',
    bgColor: 'bg-gradient-to-br from-[#3B091B] via-[#63142F] to-[#991B41]',
    glowColor: 'bg-rose-400/25',
  },
  {
    id: 3,
    badge: 'Cafe Partner',
    icon: Store,
    badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20',
    title: 'Grow Your Venue Business with Fahara',
    subtitle: 'List your cafe or space, receive instant party reservations & maximize revenue.',
    ctaText: 'Become a Cafe Partner',
    ctaLink: '/contact',
    bgColor: 'bg-gradient-to-br from-[#06241D] via-[#0E473B] to-[#1A6E5C]',
    glowColor: 'bg-emerald-400/25',
  },
  {
    id: 4,
    badge: 'Event Partner',
    icon: CalendarCheck,
    badgeBg: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20',
    title: 'Partner with Fahara as an Event Specialist',
    subtitle: 'Offer your decor, photography, catering, or entertainment services for events.',
    ctaText: 'Become an Event Partner',
    ctaLink: '/contact',
    bgColor: 'bg-gradient-to-br from-[#1B0B33] via-[#35165E] to-[#5D289B]',
    glowColor: 'bg-purple-400/25',
  },
];

export default function FaharaHeroBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance threshold (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
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

  const currentBanner = BANNERS[currentIndex];

  return (
    <div 
      className="relative w-full mb-6 overflow-hidden rounded-3xl border border-stone-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.08)] bg-[#2C1810]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full h-[220px] xs:h-[250px] sm:h-[300px] lg:h-[340px] flex items-center overflow-hidden">
        
        {/* Animated Banner Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`absolute inset-0 w-full h-full ${currentBanner.bgColor || 'bg-[#2C1810]'}`}
          >
            {/* Ambient Decorative Color Layer & Glowing Orbs */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              {/* Glowing Ambient Color Orbs */}
              <div className={`absolute -right-16 -top-16 w-96 h-96 rounded-full blur-3xl opacity-60 ${currentBanner.glowColor}`} />
              <div className={`absolute right-1/4 -bottom-24 w-80 h-80 rounded-full blur-3xl opacity-40 ${currentBanner.glowColor}`} />
              <div className="absolute left-10 -bottom-16 w-60 h-60 rounded-full blur-2xl opacity-20 bg-white" />
              
              {/* Modern Mesh Grid Light Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent opacity-80" />
            </div>

            {/* Banner Text Content */}
            <div className="relative z-10 h-full max-w-2xl flex flex-col justify-center px-5 sm:px-10 py-6 text-white space-y-2 sm:space-y-3">
              
              {/* Badge */}
              <div className="self-start">
                {(() => {
                  const BadgeIcon = currentBanner.icon || Sparkles;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wide shadow-xs ${currentBanner.badgeBg}`}>
                      <BadgeIcon size={13} className="shrink-0" />
                      <span>{currentBanner.badge}</span>
                    </span>
                  );
                })()}
              </div>

              {/* Title */}
              <h2 className="text-lg xs:text-xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-white drop-shadow-md">
                {currentBanner.title}
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm lg:text-base text-amber-100/90 font-medium max-w-lg leading-relaxed line-clamp-2 drop-shadow-xs">
                {currentBanner.subtitle}
              </p>

              {/* Conditional CTA Button (For Cafe & Event Partner Banners) */}
              {currentBanner.ctaText && currentBanner.ctaLink && (
                <div className="pt-1">
                  <Link href={currentBanner.ctaLink}>
                    <button className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95">
                      <span>{currentBanner.ctaText}</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots & Indicator */}
        <div className="absolute bottom-3 right-4 sm:right-8 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {BANNERS.map((b, idx) => (
            <button
              key={b.id}
              suppressHydrationWarning
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
