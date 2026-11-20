'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Flame, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Bike, 
  UtensilsCrossed, 
  Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

export default function FoodPromotionalCarousel({ activeOffers = [] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dynamicBanners, setDynamicBanners] = useState([]);
  
  // Drag / Swipe interactive state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = useRef(null);
  const touchCurrentXRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const containerRef = useRef(null);

  // Helper to scroll to popular restaurants section
  const scrollToRestaurants = useCallback(() => {
    const el = document.getElementById('popular-restaurants-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/customer/food#popular-restaurants-section');
    }
  }, [router]);

  // 1. Fetch Dynamic Banners from Marketing API for Food Hero
  useEffect(() => {
    let isMounted = true;
    async function fetchFoodBanners() {
      try {
        const res = await api.get('/marketing/public/banners?position=FOOD_HERO');
        const dbBanners = res.data?.data;
        if (isMounted && Array.isArray(dbBanners) && dbBanners.length > 0) {
          setDynamicBanners(dbBanners);
        }
      } catch (err) {
        console.warn('Could not load dynamic food banners:', err?.message);
      }
    }
    fetchFoodBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  // Find real offers if available for fallbacks
  const realBogoOffer = activeOffers.find(
    (o) => o.offer_type === 'BUY_X_GET_Y' || o.offer_category === 'BOGO'
  );
  const realLiveOffers = activeOffers.filter(
    (o) => o.id !== realBogoOffer?.id
  );
  const topLiveOffer = realLiveOffers[0] || null;

  // Build the slides
  const defaultSlides = [
    // Slide 1 – BOGO Food Offers
    {
      id: 'slide-bogo',
      badge: 'BOGO FOOD SPECIAL',
      badgeIcon: Sparkles,
      headline: 'Buy 1. Get 1 FREE!',
      highlightText: 'FREE!',
      description: realBogoOffer?.title 
        ? `${realBogoOffer.title} at ${realBogoOffer.cafes?.name || 'participating restaurants'}.` 
        : 'Double the food, double the happiness on your favourite dishes.',
      ctaText: 'Explore BOGO Deals',
      ctaAction: () => {
        router.push('/offers?category=BOGO');
      },
      image: realBogoOffer?.image_url || '/pure_biryani_clean.png',
      imageAlt: 'Delicious Biryani Food Special',
      gradient: 'from-[#E50914] via-[#D32F2F] to-[#991B1B]',
      tagline: 'Fresh & Hot Everyday'
    },

    // Slide 2 – Restaurant Food Specials
    {
      id: 'slide-specials',
      badge: 'RESTAURANT SPECIALS',
      badgeIcon: Flame,
      headline: 'Your Favourite Food,',
      subHeadline: 'Your Favourite Deals!',
      description: 'Discover mouth-watering meals, sizzling combos and exclusive restaurant offers.',
      ctaText: 'Explore Food Deals',
      ctaAction: () => {
        router.push('/offers');
      },
      image: '/biryani_clean.png',
      imageAlt: 'Restaurant Food Feast',
      gradient: 'from-[#991B1B] via-[#B71C1C] to-[#E50914]',
      tagline: 'Best Prices'
    },

    // Slide 3 – Food Delivery & Takeaway
    {
      id: 'slide-delivery',
      badge: 'DELIVERY & TAKEAWAY',
      badgeIcon: Bike,
      headline: 'Your Cravings,',
      subHeadline: 'Delivered Fast!',
      description: 'Order online for speedy doorstep delivery or quick, convenient restaurant takeaway.',
      ctaText: 'Order Now',
      ctaAction: scrollToRestaurants,
      image: '/shake_clean.png',
      imageAlt: 'Fast Food Delivery',
      gradient: 'from-[#B71C1C] via-[#E50914] to-[#C2185B]',
      tagline: 'Doorstep Delivery'
    },

    // Slide 4 – Live Restaurant Offers
    ...(topLiveOffer ? [{
      id: `slide-live-${topLiveOffer.id}`,
      badge: `HOT DEAL • ${topLiveOffer.cafes?.name || 'RESTAURANT'}`,
      badgeIcon: Tag,
      headline: topLiveOffer.title || 'Live Restaurant Deal',
      description: topLiveOffer.description || (
        topLiveOffer.discount_type === 'PERCENTAGE'
          ? `Enjoy flat ${topLiveOffer.discount_value}% OFF at ${topLiveOffer.cafes?.name || 'selected restaurant'}.`
          : `Save ₹${topLiveOffer.discount_value} OFF on qualifying delicious orders.`
      ),
      ctaText: 'Grab This Deal',
      ctaAction: () => {
        if (topLiveOffer.cafe_id) {
          router.push(`/customer/cafes/${topLiveOffer.cafe_id}`);
        } else {
          router.push('/offers');
        }
      },
      image: topLiveOffer.image_url || topLiveOffer.cafes?.cover_image || '/hero_biryani_cut.png',
      imageAlt: topLiveOffer.title,
      gradient: 'from-[#7F1D1D] via-[#B71C1C] to-[#E50914]',
      tagline: topLiveOffer.discount_type === 'PERCENTAGE' ? `${topLiveOffer.discount_value}% OFF` : `₹${topLiveOffer.discount_value} OFF`
    }] : [{
      id: 'slide-live-fallback',
      badge: 'FRESH MENU OFFERS',
      badgeIcon: Tag,
      headline: 'Sizzling Dishes,',
      subHeadline: 'Exclusive Discounts!',
      description: 'Handcrafted delicacies from top-rated restaurants with active savings on every order.',
      ctaText: 'Explore Restaurants',
      ctaAction: scrollToRestaurants,
      image: '/hero_biryani_cut.png',
      imageAlt: 'Delicious Fresh Meal',
      gradient: 'from-[#7F1D1D] via-[#B71C1C] to-[#E50914]',
      tagline: 'Top Rated'
    }])
  ];

  const slides = dynamicBanners.length > 0
    ? [
        ...dynamicBanners.map((b) => ({
          id: b.id,
          isDynamic: true,
          badge: b.highlight_text || 'SPECIAL FOOD OFFER',
          badgeIcon: Sparkles,
          headline: b.title || b.name,
          subHeadline: b.highlight_text ? `• ${b.highlight_text}` : '',
          description: b.description || 'Exclusive delicious offerings curated specially for you.',
          ctaText: b.cta_text || 'Grab Now',
          ctaAction: () => {
            api.post(`/marketing/public/banners/${b.id}/analytics`, { type: 'click' }).catch(() => {});
            if (b.cta_link?.startsWith('http')) {
              window.open(b.cta_link, '_blank');
            } else {
              router.push(b.cta_link || '/customer/food');
            }
          },
          image: b.desktop_image_url || b.mobile_image_url || null,
          mobileImage: b.mobile_image_url || b.desktop_image_url || null,
          bgColor: b.bg_color || '#E50914',
          textColor: b.text_color || '#FFFFFF',
          gradient: 'from-[#E50914] via-[#D32F2F] to-[#991B1B]',
          tagline: 'Fresh & Hot Everyday'
        })),
        ...defaultSlides
      ]
    : defaultSlides;

  // Record impression for active dynamic slide
  useEffect(() => {
    const currentSlide = slides[currentIndex];
    if (currentSlide?.isDynamic && currentSlide?.id) {
      api.post(`/marketing/public/banners/${currentSlide.id}/analytics`, { type: 'impression' }).catch(() => {});
    }
  }, [currentIndex, slides]);

  // Next and Prev handlers
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-slide every 5 seconds when not hovered/dragged
  useEffect(() => {
    if (isPaused || isDragging || slides.length <= 1) return;

    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, isDragging, slides.length, handleNext]);

  // ── TOUCH / MOUSE SWIPE & DRAG HANDLERS (Smooth Movable Carousel) ──
  const handlePointerDown = (clientX) => {
    touchStartXRef.current = clientX;
    touchCurrentXRef.current = clientX;
    setIsDragging(true);
    setIsPaused(true);
  };

  const handlePointerMove = (clientX) => {
    if (!isDragging || touchStartXRef.current === null) return;
    touchCurrentXRef.current = clientX;
    const diff = clientX - touchStartXRef.current;
    // Dampen drag
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    const distance = (touchCurrentXRef.current || 0) - (touchStartXRef.current || 0);
    const minDistance = 50; // px threshold to trigger slide change

    if (distance < -minDistance) {
      handleNext();
    } else if (distance > minDistance) {
      handlePrev();
    }

    setDragOffset(0);
    setIsDragging(false);
    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
    setIsPaused(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsPaused(false);
        if (isDragging) handlePointerUp();
      }}
      // Mouse drag events
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      // Mobile touch events
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
      onTouchEnd={handlePointerUp}
      aria-roledescription="carousel"
      aria-label="Food Promotional Offers"
    >
      {/* ── Slide Viewport Container (Slightly Bigger with Drag Movement) ── */}
      <div 
        className={cn(
          "flex",
          isDragging ? "transition-none" : "transition-transform duration-500 ease-out"
        )}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
        }}
      >
        {slides.map((slide, idx) => {
          const BadgeIcon = slide.badgeIcon || Sparkles;
          return (
            <div 
              key={slide.id || idx}
              className="w-full shrink-0"
            >
              <div 
                className={cn(
                  // Bigger dimensions for both mobile and desktop (min-h increased to 220px on mobile, 250px on tablet, 270px on desktop)
                  "relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br text-white shadow-lg border border-white/15 p-4 xs:p-6 sm:p-7 lg:p-9 flex flex-col justify-between min-h-[220px] xs:min-h-[240px] sm:min-h-[260px] lg:min-h-[280px]",
                  slide.gradient
                )}
                style={slide.bgColor ? { backgroundColor: slide.bgColor } : {}}
              >
                {/* Background Artwork Image for Dynamic Banners */}
                {slide.image && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* Multi-layered dark gradient overlay ensuring 100% readable text on any artwork */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35 z-10" />
                    <img
                      src={slide.image}
                      alt={slide.headline || 'Banner'}
                      className="w-full h-full object-cover object-center scale-105"
                      loading="eager"
                    />
                  </div>
                )}

                {/* Ambient glow for fallback slides */}
                {!slide.image && (
                  <>
                    <div className="absolute -top-12 -right-12 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
                  </>
                )}

                {/* Top Badge Row */}
                <div className="relative z-20 flex items-center justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-[9px] xs:text-[11px] font-black uppercase tracking-wider text-white shadow-2xs">
                    <BadgeIcon size={12} className="text-amber-300" />
                    <span className="truncate max-w-[200px] xs:max-w-none">{slide.badge}</span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/20 backdrop-blur-xs border border-amber-300/40 text-amber-200 text-[8.5px] xs:text-[10px] font-black uppercase tracking-wider">
                    <span>{slide.tagline}</span>
                  </div>
                </div>

                {/* Main Content Layout (Heading, Subtitle, CTA) */}
                <div className="relative z-20 flex items-center justify-between gap-4 my-auto">
                  <div className="space-y-2 xs:space-y-2.5 md:space-y-3 max-w-full">
                    <h3 
                      className="text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-[36px] font-black tracking-tight leading-[1.2] line-clamp-2"
                      style={slide.textColor ? { color: slide.textColor } : { color: '#FFFFFF' }}
                    >
                      {slide.headline}{' '}
                      {slide.subHeadline && (
                        <span className="text-amber-300 font-extrabold block xs:inline">{slide.subHeadline}</span>
                      )}
                    </h3>

                    <p 
                      className="text-[10.5px] xs:text-xs sm:text-sm md:text-[15px] font-medium leading-relaxed line-clamp-2 max-w-2xl opacity-95 text-white/90"
                      style={slide.textColor ? { color: slide.textColor } : { color: '#FFFFFF' }}
                    >
                      {slide.description}
                    </p>

                    <div className="pt-1 xs:pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          slide.ctaAction();
                        }}
                        className="inline-flex items-center gap-2 px-3.5 xs:px-4.5 md:px-6 py-1.5 xs:py-2 md:py-3 rounded-xl md:rounded-2xl bg-white text-[#E50914] text-[10px] xs:text-xs md:text-sm font-black shadow-lg hover:bg-stone-50 active:scale-95 transition-all cursor-pointer shrink-0"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight size={13} className="text-[#E50914]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Movable Dots Indicator */}
                {slides.length > 1 && (
                  <div className="relative z-20 flex items-center justify-center gap-2 pt-2">
                    {slides.map((_, dotIdx) => (
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
                            ? "w-7 xs:w-8 bg-white shadow-xs"
                            : "w-2 bg-white/40 hover:bg-white/70"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop Interactive Navigation Arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous slide"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer z-30 active:scale-90 shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next slide"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer z-30 active:scale-90 shadow-lg"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
}
