'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, ArrowRight, ChevronLeft, ChevronRight, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import CafeCard from '@/app/components/cards/CafeCard';

export default function DealsAndOffersSection({ cafes = [], isLoading = false, onViewAll }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter ONLY customer-visible cafes with active offers
  const cafesWithOffers = cafes.filter(cafe => {
    if (!cafe) return false;
    
    // Active offer checks
    const hasArrayDiscounts = Array.isArray(cafe.discounts) && cafe.discounts.some(d => d && (d.title || d.name || Number(d.amount) > 0) && d.is_active !== false);
    const hasObjDiscounts = cafe.discounts && typeof cafe.discounts === 'object' && !Array.isArray(cafe.discounts) && (Number(cafe.discounts.discount1_amount) > 0 || Number(cafe.discounts.discount2_amount) > 0);
    const hasPkgDiscount = Array.isArray(cafe.cafe_packages) && cafe.cafe_packages.some(p => Number(p.discount || p.discount_percentage || p.discount_amount) > 0);
    const hasOfferProp = Boolean(cafe.offer || cafe.offers || cafe.special_offer || cafe.discount || cafe.has_discount || cafe.has_offer || Number(cafe.discount_percentage) > 0 || Number(cafe.offer_amount) > 0);
    
    return hasArrayDiscounts || hasObjDiscounts || hasPkgDiscount || hasOfferProp;
  });

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState);
      window.addEventListener('resize', updateScrollState);
      return () => {
        el.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, [cafesWithOffers]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2 animate-pulse">
            <div className="h-6 w-44 bg-stone-200 rounded-md" />
            <div className="h-4 w-64 bg-stone-100 rounded-md" />
          </div>
        </div>
        <div className="flex gap-5 overflow-hidden py-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-[300px] h-[320px] shrink-0 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // If no cafes with active offers exist, hide section cleanly to prevent empty space
  if (cafesWithOffers.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8 p-4 sm:p-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F2] to-[#FFF4E8] rounded-[24px] border border-[#E8DED5] shadow-[0_4px_24px_rgba(44,24,16,0.04)] relative overflow-hidden group/deals"
    >
      {/* MODERN SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        
        {/* Left: Flame/Offer Tag Icon + Title + Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#FF758C] via-[#FF7E5F] to-[#FEB47B] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(255,117,140,0.35)] border border-white/40">
            <Tag size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight leading-none">
                DEALS & OFFERS
              </h2>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/80 tracking-wide uppercase animate-pulse">
                LIMITED DEALS
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-[#7D6B60] font-medium mt-1">
              Exclusive offers & instant savings from cafes near you
            </p>
          </div>
        </div>

        {/* Right: View All Button & Nav Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t border-[#E8DED5]/60 sm:border-t-0">
          <button
            suppressHydrationWarning
            onClick={() => onViewAll && onViewAll('discounts')}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#5A3215] hover:bg-[#3C200A] text-white font-extrabold text-xs transition-all duration-200 flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={14} className="stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              suppressHydrationWarning
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll deals left"
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 border shadow-2xs ${
                canScrollLeft 
                  ? 'bg-white hover:bg-[#5A3215] text-[#2C1810] hover:text-white border-[#E8DED5] cursor-pointer active:scale-95' 
                  : 'bg-stone-100/60 text-stone-300 border-stone-200/60 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronLeft size={18} className="stroke-[2.5]" />
            </button>
            <button
              suppressHydrationWarning
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll deals right"
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 border shadow-2xs ${
                canScrollRight 
                  ? 'bg-white hover:bg-[#5A3215] text-[#2C1810] hover:text-white border-[#E8DED5] cursor-pointer active:scale-95' 
                  : 'bg-stone-100/60 text-stone-300 border-stone-200/60 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronRight size={18} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL OF CAFE CARDS WITH ACTIVE OFFERS */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth relative z-10 select-none snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {cafesWithOffers.map((cafe) => (
          <div 
            key={cafe.id || cafe._id || cafe.cafe_id}
            className="w-[82vw] max-w-[310px] sm:w-[320px] md:w-[340px] shrink-0 snap-start"
          >
            <CafeCard cafe={cafe} activeCategory="offers" />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
