'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Compass, Check, Coffee, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Fahara-compatible pastel backgrounds per category/occasion
 */
const getCategoryPastelStyle = (title = '', id = '') => {
  const norm = (title || id || '').toLowerCase().trim();
  if (norm.includes('coffee') || norm.includes('cafe') || norm === 'cafes') {
    return 'bg-[#FFF4D6] text-[#6F4E37] border-[#E8DED5]'; // Soft Cream
  }
  if (norm.includes('restaurant')) {
    return 'bg-[#FFF0E3] text-[#7A3E1D] border-[#E8DED5]'; // Soft Peach
  }
  if (norm.includes('bakery')) {
    return 'bg-[#FFF5D9] text-[#705218] border-[#E8DED5]'; // Soft Yellow
  }
  if (norm.includes('party') || norm.includes('hall')) {
    return 'bg-[#F4E5FF] text-[#5C2B7A] border-[#E8DED5]'; // Soft Lavender
  }
  if (norm.includes('event') || norm.includes('spaces')) {
    return 'bg-[#E2F8EF] text-[#1B6645] border-[#E8DED5]'; // Soft Mint
  }
  if (norm.includes('dining') || norm.includes('private')) {
    return 'bg-[#F5EDE4] text-[#5C4033] border-[#E8DED5]'; // Soft Beige
  }
  if (norm.includes('birthday')) {
    return 'bg-[#FFE4ED] text-[#8C234E] border-[#E8DED5]'; // Soft Pink
  }
  if (norm.includes('engagement') || norm.includes('anniversary') || norm.includes('wedding')) {
    return 'bg-[#FFE5EE] text-[#861B48] border-[#E8DED5]'; // Soft Rose
  }
  if (norm.includes('corporate') || norm.includes('meeting') || norm.includes('work')) {
    return 'bg-[#E7EEFF] text-[#2B4C7E] border-[#E8DED5]'; // Soft Blue
  }
  if (norm.includes('music') || norm.includes('live')) {
    return 'bg-[#EEE5FF] text-[#4A2B7E] border-[#E8DED5]'; // Soft Purple
  }
  if (norm.includes('all') || norm.includes('spaces')) {
    return 'bg-[#F5EDE4] text-[#5A3215] border-[#E8DED5]'; // Soft Brown
  }
  return 'bg-[#FFF4D6] text-[#6F4E37] border-[#E8DED5]';
};

export default function DiscoveryCategorySection({
  title = "EXPLORE FAHARA",
  subtitle = "Find cafes, spaces & occasions",
  headerIcon: HeaderIcon = Compass,
  items = [],
  selectedId = '',
  onSelect,
  onClear,
  isLoading = false,
  isError = false,
  onRetry
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    if (!mounted) return;
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
  }, [items, mounted]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Support horizontal scroll with mouse wheel over carousel
  const handleWheelScroll = (e) => {
    if (scrollRef.current && e.deltaY !== 0) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div 
      suppressHydrationWarning 
      className="mb-8 p-4 sm:p-6 bg-gradient-to-b from-[#FFFDF9] to-[#FFF9F2] rounded-[24px] border border-[#E8DED5] shadow-[0_4px_20px_rgba(44,24,16,0.04)] relative overflow-hidden group/container transition-all duration-300"
    >
      {/* CLEAN MODERN HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-5 relative z-10">
        
        {/* Left: WHAT'S ON YOUR MIND? Title + Explore More Pill + Subtitle (NO ICON) */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-2xl font-black text-[#2C1810] tracking-tight leading-none uppercase">
              WHAT'S ON YOUR MIND?
            </h2>

            {/* Explore More Pill */}
            <span className="text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#EFE5DB] text-[#6F4E37] border border-[#DDB892]/40 tracking-wide shadow-2xs">
              Explore more
            </span>
          </div>

          {subtitle && (
            <p className="text-[11px] sm:text-[13px] text-[#7D6B60] font-medium mt-0.5 sm:mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: View All Button & Nav Arrows */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t border-[#E8DED5]/60 sm:border-t-0">
          {selectedId && onClear ? (
            <motion.button 
              suppressHydrationWarning
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className="text-[11px] sm:text-xs font-black text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-rose-200/80 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>Clear Filter</span>
            </motion.button>
          ) : (
            <button
              suppressHydrationWarning
              onClick={() => onSelect && onSelect('All Spaces')}
              className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#EFE5DB]/80 hover:bg-[#5A3215] text-[#6F4E37] hover:text-white font-black text-[11px] sm:text-xs border border-[#DDB892]/40 transition-all duration-200 flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <span>View All</span>
              <span className="text-xs sm:text-sm">→</span>
            </button>
          )}

          {/* Nav Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              suppressHydrationWarning
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll category list left"
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 border shadow-2xs ${
                canScrollLeft 
                  ? 'bg-white hover:bg-[#5A3215] text-[#2C1810] hover:text-white border-[#E5D7CA] cursor-pointer active:scale-95' 
                  : 'bg-stone-100/60 text-stone-300 border-stone-200/60 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronLeft size={16} className="stroke-[2.5]" />
            </button>
            <button
              suppressHydrationWarning
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll category list right"
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 border shadow-2xs ${
                canScrollRight 
                  ? 'bg-white hover:bg-[#5A3215] text-[#2C1810] hover:text-white border-[#E5D7CA] cursor-pointer active:scale-95' 
                  : 'bg-stone-100/60 text-stone-300 border-stone-200/60 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronRight size={16} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* COMPACT CAROUSEL BODY WITH IMAGE THUMBNAILS */}
      {isError ? (
        <div className="flex flex-col items-center justify-center py-4 text-center space-y-2 bg-stone-50/70 rounded-xl border border-stone-200/60">
          <AlertCircle size={24} className="text-amber-700" />
          <p className="text-xs font-bold text-[#2C1810]">Unable to load discovery</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#5A3215] text-white text-[11px] font-bold rounded-lg hover:bg-[#43230E] transition-all cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Retry</span>
            </button>
          )}
        </div>
      ) : isLoading ? (
        <div className="flex gap-4 overflow-hidden py-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col items-center shrink-0 space-y-2 animate-pulse w-[80px] sm:w-[95px] md:w-[110px]">
              <div className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] md:w-[82px] md:h-[82px] rounded-full bg-stone-200/80 border border-[#E8DED5]" />
              <div className="h-3.5 w-14 bg-stone-200 rounded-md" />
              <div className="h-3 w-10 bg-stone-100 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          onWheel={handleWheelScroll}
          className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth relative z-10 select-none snap-x snap-mandatory justify-start sm:justify-start"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.map((item) => {
            const Icon = item.icon || Coffee;
            const isSelected = selectedId && (
              selectedId.toLowerCase().trim() === item.id.toLowerCase().trim() ||
              (item.slug && selectedId.toLowerCase().trim() === item.slug.toLowerCase().trim())
            );

            const pastelStyle = getCategoryPastelStyle(item.title, item.id);
            const hasValidImg = Boolean(item.image);

            return (
              <button
                key={item.id}
                type="button"
                suppressHydrationWarning
                aria-pressed={isSelected ? 'true' : 'false'}
                aria-label={`Explore ${item.title}, ${item.count || 0} venues available`}
                onClick={() => onSelect && onSelect(item.id)}
                className="flex flex-col items-center shrink-0 group cursor-pointer w-[76px] sm:w-[98px] md:w-[118px] transition-all duration-200 snap-start outline-none"
              >
                {/* Circular Image Container (96px desktop / 88px tablet / 64px mobile) */}
                <div className={`relative w-[64px] h-[64px] sm:w-[84px] sm:h-[84px] md:w-[96px] md:h-[96px] rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 ease-out group-hover:-translate-y-[3px] ${
                  isSelected
                    ? 'border-2 border-[#6F4E37] shadow-lg ring-4 ring-[#6F4E37]/20 scale-[1.04]'
                    : 'border border-[#E8DED5] shadow-[0_4px_12px_rgba(44,24,16,0.08)] group-hover:shadow-lg group-hover:border-[#6F4E37]/60'
                }`}>
                  {hasValidImg ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${pastelStyle}`}>
                      <Icon size={28} className="stroke-[2] text-[#5A3215]" />
                    </div>
                  )}

                  {/* Top-Right Check Mark Badge when Selected */}
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="absolute top-0 right-0 w-5 h-5 rounded-full bg-[#5A3215] text-white flex items-center justify-center border-2 border-white shadow-xs z-10"
                    >
                      <Check size={11} strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                {/* Category Name (14px–15px font weight 800) */}
                <span className={`text-xs sm:text-sm md:text-[14px] font-extrabold mt-2.5 text-center leading-tight truncate max-w-full transition-colors ${
                  isSelected ? 'text-[#5A3215]' : 'text-[#2C1810] group-hover:text-[#5A3215]'
                }`}>
                  {item.title}
                </span>

                {/* Grammatical Real Venue Count (1 Venue, 2 Venues, etc.) */}
                {item.count > 0 && (
                  <span className={`text-[11px] sm:text-xs font-bold mt-0.5 text-center truncate transition-colors ${
                    isSelected ? 'text-[#5C4033]' : 'text-stone-400 group-hover:text-stone-600'
                  }`}>
                    {item.count} {item.count === 1 ? 'Venue' : 'Venues'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
