'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';

// Default initial banner reflecting reference image #1 (Three-part layout with Burger & Fries, BEST DEAL, 50% OFF)
const FALLBACK_THREE_PART_BANNERS = [
  {
    id: 'fallback-best-deal-1',
    name: 'Burger Combo Best Deal',
    bannerLayout: 'THREE_PART_HERO',
    promotionalLabel: 'BEST DEAL',
    title: 'FEEL HUNGER! ORDER YOUR FAVORITE FOOD.',
    highlightText: 'BEST DEAL',
    subtitle: 'Delicious gourmet burgers, crispy golden fries and refreshing beverages crafted fresh.',
    centerImageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    mobileCenterImageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    centerImageSize: 'contain',
    centerImagePosition: 'center',
    discountValue: '50',
    discountSymbol: '%',
    offerHeading: 'OFF',
    offerSubtitle: 'Weekend Special Offer',
    offerTextColor: '#E50914',
    offerBgColor: '#FFFFFF',
    bgColor: '#FFFFFF',
    textColor: '#252525',
    badgeBg: '#E50914',
    ctaText: 'ORDER NOW',
    ctaLink: '/customer/food',
    ctaBgColor: '#E50914',
    ctaTextColor: '#FFFFFF',
    phoneContact: '918946029205',
    websiteUrl: 'fahara.in'
  },
  {
    id: 'fallback-pizza-deal-2',
    name: 'Sizzling Woodfired Pizza Feast',
    bannerLayout: 'THREE_PART_HERO',
    promotionalLabel: 'HOT DEAL',
    title: 'SIZZLING CRUST! CHEESY DELIGHTS DELIVERED.',
    highlightText: 'HOT DEAL',
    subtitle: 'Freshly baked artisanal pizzas with premium melted mozzarella & fresh herbs.',
    centerImageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
    mobileCenterImageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    centerImageSize: 'contain',
    centerImagePosition: 'center',
    discountValue: '40',
    discountSymbol: '%',
    offerHeading: 'OFF',
    offerSubtitle: 'Limited Period Deal',
    offerTextColor: '#E50914',
    offerBgColor: '#FFFFFF',
    bgColor: '#FFFFFF',
    textColor: '#252525',
    badgeBg: '#E50914',
    ctaText: 'VIEW MENU',
    ctaLink: '/customer/food',
    ctaBgColor: '#E50914',
    ctaTextColor: '#FFFFFF',
    phoneContact: '918946029205',
    websiteUrl: 'fahara.in'
  }
];

export default function FaharaHeroBannerCarousel({ position = 'HOMEPAGE_HERO' }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [banners, setBanners] = useState(FALLBACK_THREE_PART_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Drag / swipe states for movable carousel
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = useRef(null);
  const touchCurrentXRef = useRef(null);
  const timerRef = useRef(null);

  // 1. Fetch Dynamic Banners from Backend API based on position prop
  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    async function fetchDynamicBanners() {
      try {
        const queryPosition = position ? encodeURIComponent(position) : 'HOMEPAGE_HERO';
        const res = await api.get(`/marketing/public/banners?position=${queryPosition}`);
        const dbBanners = res.data?.data;
        if (isSubscribed && Array.isArray(dbBanners) && dbBanners.length > 0) {
          const mapped = dbBanners.map(b => ({
            id: b.id,
            name: b.name,
            bannerLayout: b.banner_layout || 'THREE_PART_HERO',
            promotionalLabel: b.promotional_label || b.highlight_text || 'BEST DEAL',
            title: b.title,
            highlightText: b.highlight_text || '',
            subtitle: b.subtitle || '',
            desktopImageUrl: b.desktop_image_url,
            mobileImageUrl: b.mobile_image_url,
            centerImageUrl: b.center_image_url || b.desktop_image_url,
            mobileCenterImageUrl: b.mobile_center_image_url || b.mobile_image_url || b.center_image_url,
            centerImageSize: b.center_image_size || 'contain',
            centerImagePosition: b.center_image_position || 'center',
            discountValue: b.discount_value !== null && b.discount_value !== undefined ? b.discount_value.trim() : '',
            discountSymbol: b.discount_symbol !== null && b.discount_symbol !== undefined ? b.discount_symbol.trim() : '',
            offerHeading: b.offer_heading !== null && b.offer_heading !== undefined ? b.offer_heading.trim() : '',
            offerSubtitle: b.offer_subtitle || '',
            offerTextColor: b.offer_text_color || '#E50914',
            offerBgColor: b.offer_bg_color || '#FFFFFF',
            bgColor: b.bg_color || '#FFFFFF',
            textColor: b.text_color || '#252525',
            badgeBg: b.badge_bg || '#E50914',
            ctaText: b.cta_text || 'ORDER NOW',
            ctaLink: b.cta_link || '/customer/food',
            ctaBgColor: b.cta_bg_color || '#E50914',
            ctaTextColor: b.cta_text_color || '#FFFFFF',
            phoneContact: '918946029205',
            websiteUrl: 'fahara.in'
          }));
          setBanners(mapped);
        }
      } catch (err) {
        console.warn('Using fallback hero banners:', err?.message);
      }
    }

    fetchDynamicBanners();
    return () => {
      isSubscribed = false;
    };
  }, [position]);

  const handleNext = useCallback(() => {
    setBanners((prevBanners) => {
      if (!prevBanners || prevBanners.length <= 1) return prevBanners;
      setCurrentIndex((prev) => (prev + 1) % prevBanners.length);
      return prevBanners;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setBanners((prevBanners) => {
      if (!prevBanners || prevBanners.length <= 1) return prevBanners;
      setCurrentIndex((prev) => (prev - 1 + prevBanners.length) % prevBanners.length);
      return prevBanners;
    });
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!mounted || isPaused || isDragging || banners.length <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mounted, isPaused, isDragging, banners.length, handleNext]);

  // Pointer drag & touch events for movable carousel
  const handlePointerDown = (clientX) => {
    touchStartXRef.current = clientX;
    touchCurrentXRef.current = clientX;
    setIsDragging(true);
    setIsPaused(true);
  };

  const handlePointerMove = (clientX) => {
    if (!isDragging || touchStartXRef.current === null) return;
    touchCurrentXRef.current = clientX;
    setDragOffset(clientX - touchStartXRef.current);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    const distance = (touchCurrentXRef.current || 0) - (touchStartXRef.current || 0);
    const minSwipe = 45;

    if (distance < -minSwipe) {
      handleNext();
    } else if (distance > minSwipe) {
      handlePrev();
    }

    setDragOffset(0);
    setIsDragging(false);
    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
    setIsPaused(false);
  };

  const handleBannerClick = (banner) => {
    if (banner.id && banner.id.length > 10) {
      api.post(`/marketing/public/banners/${banner.id}/analytics`, { type: 'click' }).catch(() => null);
    }
  };

  // Record impression for active slide
  useEffect(() => {
    const current = banners[currentIndex];
    if (current?.id && current.id.length > 10) {
      api.post(`/marketing/public/banners/${current.id}/analytics`, { type: 'impression' }).catch(() => null);
    }
  }, [currentIndex, banners]);

  if (!mounted) {
    return (
      <div className="w-full h-[220px] sm:h-[260px] lg:h-[300px] bg-stone-100 rounded-2xl animate-pulse" />
    );
  }

  const current = banners[currentIndex] || banners[0];

  return (
    <div 
      className="w-full relative py-1 select-none cursor-grab active:cursor-grabbing group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsPaused(false);
        if (isDragging) handlePointerUp();
      }}
      // Mouse drag
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      // Touch swipe
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
      onTouchEnd={handlePointerUp}
      aria-label="Grab2Go Hero Banner"
    >
      {/* ── MAIN THREE-PART HERO BANNER VIEWPORT ── */}
      <div 
        className={cn(
          "relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border border-stone-200/90 transition-all min-h-[175px] xs:min-h-[195px] sm:min-h-[260px] lg:min-h-[290px]",
          isDragging ? "transition-none" : "transition-transform duration-500 ease-out"
        )}
        style={{
          backgroundColor: current.bgColor || '#FFFFFF',
          transform: `translateX(${dragOffset}px)`
        }}
      >
        {/* Subtle Textured Background Pattern (Off-white canvas) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 z-0 bg-repeat"
          style={{
            backgroundImage: `radial-gradient(#d4d4d8 0.75px, transparent 0.75px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* ── THREE-PART COMPOSITION ── */}
        <div className="relative z-10 w-full h-full p-2.5 xs:p-3.5 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[175px] xs:min-h-[195px] sm:min-h-[260px] lg:min-h-[290px]">
          
          {/* Main Content Grid: Dynamic columns based on whether right offer exists */}
          {(() => {
            const hasRightOffer = Boolean(current.discountValue || current.offerHeading);

            return (
              <div className="grid grid-cols-12 items-center gap-1 sm:gap-4 my-auto w-full">
                
                {/* ── 1. LEFT CORNER – PROMOTIONAL CONTENT ── */}
                <div className={cn(
                  "space-y-1 xs:space-y-1.5 sm:space-y-3 z-10 text-left min-w-0",
                  hasRightOffer
                    ? "col-span-5 sm:col-span-4 lg:col-span-4"
                    : "col-span-7 sm:col-span-6 lg:col-span-6"
                )}>
                  
                  {/* Promotional Brand Label (e.g. BEST DEAL Badge) */}
                  <div className="inline-block">
                    <div 
                      className="inline-block px-1.5 py-0.5 xs:px-2.5 xs:py-1 sm:px-4 sm:py-1.5 rounded-md xs:rounded-lg sm:rounded-xl shadow-xs sm:shadow-md transform -rotate-1 border border-white/20"
                      style={{
                        backgroundColor: current.badgeBg || '#E50914',
                        color: '#FFFFFF'
                      }}
                    >
                      <span className="text-[8px] xs:text-[9.5px] sm:text-base lg:text-xl font-black uppercase tracking-wider block leading-none drop-shadow-xs">
                        {current.promotionalLabel || 'BEST DEAL'}
                      </span>
                    </div>
                  </div>

                  {/* Main Heading & Highlighted Text */}
                  <div className="space-y-0.5 xs:space-y-1 min-w-0">
                    <h2 
                      className={cn(
                        "font-black tracking-tight uppercase leading-[1.15] break-words",
                        hasRightOffer
                          ? "text-[10px] xs:text-[11px] sm:text-lg lg:text-2xl line-clamp-2"
                          : "text-xs xs:text-sm sm:text-xl lg:text-2xl line-clamp-3"
                      )}
                      style={{ color: current.textColor || '#252525' }}
                    >
                      {current.title}
                    </h2>
                    
                    {/* Short Supporting Description */}
                    {current.subtitle && (
                      <p 
                        className={cn(
                          "font-medium leading-tight sm:leading-relaxed max-w-sm opacity-85 break-words",
                          hasRightOffer
                            ? "text-[7.5px] xs:text-[9px] sm:text-xs lg:text-sm line-clamp-1 sm:line-clamp-2"
                            : "text-[8.5px] xs:text-[10px] sm:text-xs lg:text-sm line-clamp-2"
                        )}
                        style={{ color: current.textColor || '#252525' }}
                      >
                        {current.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Bottom CTA Button (Left corner bottom) */}
                  <div className="pt-0.5 sm:pt-2">
                    <Link
                      href={current.ctaLink || '/customer/food'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBannerClick(current);
                      }}
                    >
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 xs:px-3 xs:py-1.5 sm:px-5 sm:py-2.5 rounded-full font-black text-[8px] xs:text-[9.5px] sm:text-xs lg:text-sm shadow-xs sm:shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider max-w-full"
                        style={{
                          backgroundColor: current.ctaBgColor || '#E50914',
                          color: current.ctaTextColor || '#FFFFFF'
                        }}
                      >
                        <span className="truncate max-w-[95px] xs:max-w-[130px] sm:max-w-none">{current.ctaText || 'ORDER NOW'}</span>
                        <ArrowRight size={9} className="sm:w-3 sm:h-3 shrink-0" />
                      </button>
                    </Link>
                  </div>

                </div>

                {/* ── 2. CENTER – MAIN FOOD VISUAL (Rounded Image with Premium Drop Shadow) ── */}
                <div className={cn(
                  "flex items-center justify-center relative z-0 px-0.5",
                  hasRightOffer
                    ? "col-span-3 sm:col-span-4 lg:col-span-4"
                    : "col-span-5 sm:col-span-6 lg:col-span-6 justify-end sm:justify-center pr-1 sm:pr-0"
                )}>
                  {current.centerImageUrl ? (
                    <div className={cn(
                      "relative flex items-center justify-center transition-all shrink-0",
                      hasRightOffer
                        ? "w-16 h-16 xs:w-20 xs:h-20 sm:w-44 sm:h-44 lg:w-56 lg:h-56"
                        : "w-22 h-22 xs:w-30 xs:h-30 sm:w-48 sm:h-48 lg:w-60 lg:h-60"
                    )}>
                      {/* Soft circular ground shadow */}
                      <div className="absolute -bottom-1.5 w-4/5 h-3 sm:h-6 bg-black/20 rounded-full blur-xs sm:blur-md pointer-events-none" />
                      
                      {/* Center Rounded Food Image Container */}
                      <div className="w-full h-full rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-md sm:shadow-2xl bg-white flex items-center justify-center relative z-10 transform hover:scale-105 transition-transform duration-300">
                        <img
                          src={current.centerImageUrl}
                          alt={current.name || 'Food visual'}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-14 h-14 sm:w-44 sm:h-44 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 border-2 border-white shadow-md">
                      <Sparkles size={20} />
                    </div>
                  )}
                </div>

                {/* ── 3. RIGHT CORNER – OFFER DETAILS (Optional: rendered only if discountValue or offerHeading is provided) ── */}
                {hasRightOffer && (
                  <div className="col-span-4 sm:col-span-4 lg:col-span-4 flex flex-col items-end text-right z-10 space-y-0.5 xs:space-y-1 sm:space-y-2 min-w-0">
                    
                    {/* Large Bold Promotional Offer Box */}
                    <div 
                      className="inline-flex flex-col items-center justify-center px-1.5 py-1 xs:px-2.5 xs:py-1.5 sm:px-5 sm:py-3.5 rounded-lg xs:rounded-xl sm:rounded-2xl border border-red-100 shadow-xs sm:shadow-md transform rotate-1 max-w-full"
                      style={{
                        backgroundColor: current.offerBgColor || '#FFFFFF'
                      }}
                    >
                      <div 
                        className="flex items-baseline font-black leading-none tracking-tighter"
                        style={{ color: current.offerTextColor || '#E50914' }}
                      >
                        <span className="text-base xs:text-xl sm:text-5xl lg:text-6xl font-black">
                          {current.discountValue || ''}
                        </span>
                        <span className="text-[9px] xs:text-xs sm:text-2xl lg:text-3xl font-black ml-0.5">
                          {current.discountSymbol || ''}
                        </span>
                      </div>
                      
                      {current.offerHeading && (
                        <span 
                          className="text-[7.5px] xs:text-[9.5px] sm:text-xl lg:text-2xl font-black uppercase tracking-wider block mt-0.5 leading-tight text-center max-w-[85px] xs:max-w-none"
                          style={{ color: current.offerTextColor || '#E50914' }}
                        >
                          {current.offerHeading}
                        </span>
                      )}
                    </div>

                    {/* Optional Offer Subtitle / Validity */}
                    {current.offerSubtitle && (
                      <span className="text-[7px] xs:text-[8.5px] sm:text-xs font-bold text-stone-500 uppercase tracking-tight hidden xs:inline max-w-[90px] truncate">
                        {current.offerSubtitle}
                      </span>
                    )}

                  </div>
                )}

              </div>
            );
          })()}

          {/* ── BOTTOM PAGINATION DOTS ── */}
          {banners.length > 1 && (
            <div className="relative z-20 flex items-center justify-center gap-1.5 pt-2">
              {banners.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(dotIdx);
                  }}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    currentIndex === dotIdx
                      ? "w-7 bg-[#E50914] shadow-xs"
                      : "w-2 bg-stone-300 hover:bg-stone-400"
                  )}
                />
              ))}
            </div>
          )}

        </div>

        {/* ── DESKTOP NAVIGATION ARROWS ── */}
        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous banner"
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 items-center justify-center border border-stone-200 shadow-md transition-all cursor-pointer z-30 active:scale-90"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next banner"
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 items-center justify-center border border-stone-200 shadow-md transition-all cursor-pointer z-30 active:scale-90"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

      </div>
    </div>
  );
}
