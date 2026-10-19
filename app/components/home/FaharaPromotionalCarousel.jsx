'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const PROMOTIONAL_SLIDES = [
  {
    id: 1,
    badge: 'WELCOME TO FAHARA',
    heading: 'Your Moments. Your Place.',
    description: 'Discover cafés, plan special occasions, and make every gathering memorable with Fahara.',
    cta: 'Explore Fahara',
    ctaLink: '/customer/cafe',
    image: '/cafe1.jpg',
    imageAlt: 'Warm, elegant cafe interior with ambient lighting',
    isUpcoming: false,
  },
  {
    id: 2,
    badge: 'SIMPLE & EASY',
    heading: 'Find. Book. Celebrate.',
    description: 'Discover your favourite cafés, explore event options, choose your date, and book your experience in a few simple steps.',
    cta: 'How It Works',
    ctaLink: '#how-it-works',
    image: '/cat_events.jpg',
    imageAlt: 'Cafe booking and celebration planning scene',
    isUpcoming: false,
  },
  {
    id: 3,
    badge: 'COMING SOON',
    heading: 'Something Exciting Is Brewing.',
    description: 'Exclusive café deals, special offers, and exciting experiences are coming soon to Fahara. Stay tuned!',
    cta: 'Coming Soon',
    ctaLink: null,
    image: '/cafe2.jpg',
    imageAlt: 'Premium cafe serving fresh coffee and bakery treats',
    isUpcoming: true,
  },
  {
    id: 4,
    badge: 'MAKE IT SPECIAL',
    heading: 'Celebrate Your Way.',
    description: 'Explore cafés and event options for birthdays, celebrations, and special gatherings.',
    cta: 'Explore Events',
    ctaLink: '/customer/cafe?category=Event+Space',
    image: '/cat_birthday.jpg',
    imageAlt: 'Elegant birthday celebration and private cafe setup',
    isUpcoming: false,
  },
];

export default function FaharaPromotionalCarousel({ 
  className = '', 
  compact = false 
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const minSwipeDistance = 45;

  // Auto-advance slides every 5 seconds when not paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % PROMOTIONAL_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % PROMOTIONAL_SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + PROMOTIONAL_SLIDES.length) % PROMOTIONAL_SLIDES.length);
  };

  const handleCtaClick = (slide) => {
    if (slide.isUpcoming || !slide.ctaLink) {
      return;
    }

    if (slide.ctaLink.startsWith('#')) {
      const targetId = slide.ctaLink.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(`/${slide.ctaLink}`);
      }
    } else {
      router.push(slide.ctaLink);
    }
  };

  // Touch handlers for mobile swipe gestures
  const handleTouchStart = (e) => {
    touchEndXRef.current = null;
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const currentSlide = PROMOTIONAL_SLIDES[currentIndex];

  return (
    <div 
      className={`relative w-full select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Fahara Promotional Announcements"
    >
      {/* ── MAIN HORIZONTAL SPLIT BANNER CARD ── */}
      <div className={`relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#FFF8F0] border border-[#E8DED5] shadow-[0_12px_36px_rgba(44,24,16,0.06)] flex flex-col sm:flex-row transition-all duration-300 ${
        compact ? 'min-h-[190px] p-4 xs:p-5' : 'min-h-[220px] sm:min-h-[260px] md:min-h-[280px] p-5 sm:p-7 md:p-8'
      }`}>
        
        {/* Soft Background Warm Accent Glow */}
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#EAD8C7]/40 blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-[#DDB892]/20 blur-3xl pointer-events-none" />

        {/* ── LEFT COLUMN: Text Content & Primary CTA ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-start text-left pr-0 sm:pr-6 md:pr-8 min-w-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -40 || velocity.x < -300) {
                  handleNext();
                } else if (offset.x > 40 || velocity.x > 300) {
                  handlePrev();
                }
              }}
              initial={{ opacity: 0, x: direction * 35, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: direction * -35, filter: 'blur(4px)' }}
              transition={{ duration: 0.42, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col items-start space-y-2 sm:space-y-3 w-full cursor-grab active:cursor-grabbing"
            >
              {/* Badge Pill */}
              <span className={`inline-flex items-center text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${
                currentSlide.isUpcoming 
                  ? 'bg-[#FFE8D6] text-[#A64B2A] border-[#F4A261]/40'
                  : 'bg-[#FAF2EB] text-[#A67B5B] border-[#DDB892]/60'
              }`}>
                {currentSlide.badge}
              </span>

              {/* Heading */}
              <h3 className={`font-black text-[#2C1810] tracking-tight leading-[1.12] line-clamp-2 ${
                compact 
                  ? 'text-lg xs:text-xl' 
                  : 'text-xl sm:text-2xl md:text-3xl'
              }`}>
                {currentSlide.heading}
              </h3>

              {/* Description */}
              <p className={`text-[#6D5A50] font-medium leading-relaxed max-w-md line-clamp-2 sm:line-clamp-3 ${
                compact 
                  ? 'text-[11px] xs:text-xs' 
                  : 'text-xs sm:text-sm'
              }`}>
                {currentSlide.description}
              </p>

              {/* Action Button */}
              <div className="pt-1.5 sm:pt-2">
                {currentSlide.isUpcoming ? (
                  <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#E8DED5] text-[#6D5A50] text-xs sm:text-sm font-black shadow-2xs cursor-default">
                    <span>{currentSlide.cta}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => handleCtaClick(currentSlide)}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#6F4E37] hover:bg-[#523723] active:bg-[#3B1F13] text-white text-xs sm:text-sm font-black shadow-md shadow-[#6F4E37]/25 hover:shadow-lg active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/40"
                    aria-label={`${currentSlide.cta}: ${currentSlide.heading}`}
                  >
                    <span>{currentSlide.cta}</span>
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">
                      →
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RIGHT COLUMN: High-Quality Cafe & Event Visual ── */}
        <div className="relative z-10 mt-4 sm:mt-0 sm:w-[42%] md:w-[40%] flex items-center justify-center shrink-0">
          <div className="relative w-full h-[150px] xs:h-[170px] sm:h-full min-h-[160px] sm:min-h-[190px] md:min-h-[210px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-[#E8DED5]/80 bg-stone-100">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={currentSlide.image}
                src={currentSlide.image}
                alt={currentSlide.imageAlt}
                initial={{ opacity: 0, scale: 1.06, filter: 'blur(3px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.96, filter: 'blur(3px)' }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="w-full h-full object-cover object-center select-none"
                onError={(e) => {
                  e.currentTarget.src = '/cat_cafes.jpg';
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ── PREVIOUS & NEXT CONTROLS (Accessible Desktop/Tablet Buttons) ── */}
        <button
          type="button"
          suppressHydrationWarning
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="hidden sm:flex absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#2C1810] border border-[#E8DED5] items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/40"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          suppressHydrationWarning
          onClick={handleNext}
          aria-label="Next Slide"
          className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#2C1810] border border-[#E8DED5] items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/40"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>

      </div>

      {/* ── PAGINATION DOTS (Clickable, accessible dots below banner) ── */}
      <div 
        className="flex items-center justify-center gap-2 mt-3"
        role="tablist"
        aria-label="Carousel pagination"
      >
        {PROMOTIONAL_SLIDES.map((slide, idx) => {
          const isActive = currentIndex === idx;
          return (
            <button
              key={slide.id}
              type="button"
              suppressHydrationWarning
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${idx + 1}: ${slide.heading}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/40 ${
                isActive 
                  ? 'w-6 bg-[#6F4E37] shadow-xs' 
                  : 'w-2 bg-[#DDB892]/60 hover:bg-[#6F4E37]/50'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
