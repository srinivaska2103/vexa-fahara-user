'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Compass, Check, Coffee, AlertCircle, RefreshCw,
  UtensilsCrossed, CakeSlice, Utensils, PartyPopper, Building2, Sun, Umbrella,
  GlassWater, Cake, Heart, Briefcase, Sparkles, Camera, Footprints, Flame, Store
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Professional curated icon and styling matching category theme
 */
const getCategoryIconAndStyle = (title = '', id = '') => {
  const norm = (title || id || '').toLowerCase().trim();

  if (norm.includes('coffee') || norm.includes('cafe') || norm === 'cafes') {
    return {
      icon: Coffee,
      bg: 'bg-gradient-to-br from-amber-50 to-orange-100/70',
      text: 'text-amber-700',
      border: 'border-amber-200/80',
      shadow: 'shadow-amber-500/10'
    };
  }
  if (norm.includes('restaurant')) {
    return {
      icon: UtensilsCrossed,
      bg: 'bg-gradient-to-br from-red-50 to-rose-100/70',
      text: 'text-[#E50914]',
      border: 'border-red-200/80',
      shadow: 'shadow-red-500/10'
    };
  }
  if (norm.includes('bakery') || norm.includes('pastry') || norm.includes('dessert')) {
    return {
      icon: CakeSlice,
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-100/70',
      text: 'text-amber-600',
      border: 'border-amber-200/80',
      shadow: 'shadow-yellow-500/10'
    };
  }
  if (norm.includes('bistro')) {
    return {
      icon: Utensils,
      bg: 'bg-gradient-to-br from-orange-50 to-amber-100/70',
      text: 'text-orange-700',
      border: 'border-orange-200/80',
      shadow: 'shadow-orange-500/10'
    };
  }
  if (norm.includes('party') || norm.includes('hall')) {
    return {
      icon: PartyPopper,
      bg: 'bg-gradient-to-br from-purple-50 to-pink-100/70',
      text: 'text-purple-700',
      border: 'border-purple-200/80',
      shadow: 'shadow-purple-500/10'
    };
  }
  if (norm.includes('event') || norm.includes('spaces')) {
    return {
      icon: Building2,
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-100/70',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      shadow: 'shadow-emerald-500/10'
    };
  }
  if (norm.includes('rooftop')) {
    return {
      icon: Sun,
      bg: 'bg-gradient-to-br from-sky-50 to-blue-100/70',
      text: 'text-sky-700',
      border: 'border-sky-200/80',
      shadow: 'shadow-sky-500/10'
    };
  }
  if (norm.includes('outdoor')) {
    return {
      icon: Umbrella,
      bg: 'bg-gradient-to-br from-teal-50 to-emerald-100/70',
      text: 'text-teal-700',
      border: 'border-teal-200/80',
      shadow: 'shadow-teal-500/10'
    };
  }
  if (norm.includes('dining') || norm.includes('private')) {
    return {
      icon: GlassWater,
      bg: 'bg-gradient-to-br from-rose-50 to-pink-100/70',
      text: 'text-rose-700',
      border: 'border-rose-200/80',
      shadow: 'shadow-rose-500/10'
    };
  }
  if (norm.includes('birthday')) {
    return {
      icon: Cake,
      bg: 'bg-gradient-to-br from-pink-50 to-rose-100/70',
      text: 'text-pink-700',
      border: 'border-pink-200/80',
      shadow: 'shadow-pink-500/10'
    };
  }
  if (norm.includes('engagement') || norm.includes('anniversary') || norm.includes('wedding') || norm.includes('couple')) {
    return {
      icon: Heart,
      bg: 'bg-gradient-to-br from-red-50 to-pink-100/70',
      text: 'text-red-600',
      border: 'border-red-200/80',
      shadow: 'shadow-red-500/10'
    };
  }
  if (norm.includes('corporate') || norm.includes('meeting') || norm.includes('work')) {
    return {
      icon: Briefcase,
      bg: 'bg-gradient-to-br from-indigo-50 to-blue-100/70',
      text: 'text-indigo-700',
      border: 'border-indigo-200/80',
      shadow: 'shadow-indigo-500/10'
    };
  }
  if (norm.includes('photoshoot') || norm.includes('camera')) {
    return {
      icon: Camera,
      bg: 'bg-gradient-to-br from-violet-50 to-purple-100/70',
      text: 'text-violet-700',
      border: 'border-violet-200/80',
      shadow: 'shadow-violet-500/10'
    };
  }
  if (norm.includes('walk')) {
    return {
      icon: Footprints,
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-100/70',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      shadow: 'shadow-emerald-500/10'
    };
  }
  if (norm.includes('discount') || norm.includes('offer')) {
    return {
      icon: Flame,
      bg: 'bg-gradient-to-br from-red-50 to-amber-100/70',
      text: 'text-[#E50914]',
      border: 'border-red-200/80',
      shadow: 'shadow-red-500/10'
    };
  }
  if (norm.includes('all') || norm.includes('spaces')) {
    return {
      icon: Store,
      bg: 'bg-gradient-to-br from-stone-50 to-stone-100',
      text: 'text-stone-700',
      border: 'border-stone-200/80',
      shadow: 'shadow-stone-500/10'
    };
  }

  return {
    icon: Sparkles,
    bg: 'bg-gradient-to-br from-amber-50 to-orange-100/70',
    text: 'text-amber-700',
    border: 'border-amber-200/80',
    shadow: 'shadow-amber-500/10'
  };
};

export default function DiscoveryCategorySection({
  title = "EXPLORE Grab2GO",
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
      className="mb-8 p-4 sm:p-6 bg-white rounded-[24px] border border-red-100 shadow-[0_4px_20px_rgba(229,9,20,0.03)] relative overflow-hidden group/container transition-all duration-300"
    >
      {/* CLEAN MODERN HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-5 relative z-10">
        
        {/* Left: WHAT'S ON YOUR MIND? Title + Explore More Pill + Subtitle (NO ICON) */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-2xl font-black text-[#252525] tracking-tight leading-none uppercase">
              WHAT'S ON YOUR MIND?
            </h2>

            {/* Explore More Pill */}
            <span className="text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#FFF5F5] text-[#E50914] border border-red-200 tracking-wide shadow-2xs">
              Explore more
            </span>
          </div>

          {subtitle && (
            <p className="text-[11px] sm:text-[13px] text-[#757575] font-medium mt-0.5 sm:mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: View All Button & Nav Arrows */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t border-red-100/60 sm:border-t-0">
          {selectedId && onClear ? (
            <motion.button 
              suppressHydrationWarning
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className="text-[11px] sm:text-xs font-black text-[#E50914] hover:text-[#c90812] bg-[#FFF5F5] hover:bg-red-100 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-red-200 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>Clear Filter</span>
            </motion.button>
          ) : (
            <button
              suppressHydrationWarning
              onClick={() => onSelect && onSelect('All Spaces')}
              className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#FFF5F5] hover:bg-[#E50914] text-[#E50914] hover:text-white font-black text-[11px] sm:text-xs border border-red-200 transition-all duration-200 flex items-center gap-1 shadow-2xs cursor-pointer"
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
                  ? 'bg-white hover:bg-[#E50914] text-[#252525] hover:text-white border-red-100 cursor-pointer active:scale-95' 
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
                  ? 'bg-white hover:bg-[#E50914] text-[#252525] hover:text-white border-red-100 cursor-pointer active:scale-95' 
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
          <p className="text-xs font-bold text-[#252525]">Unable to load discovery</p>
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
              <div className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] md:w-[82px] md:h-[82px] rounded-full bg-stone-200/80 border border-[#FEE2E2]" />
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
            const iconMeta = getCategoryIconAndStyle(item.title, item.id);
            const CuratedIcon = item.icon || iconMeta.icon;
            const isSelected = selectedId && (
              selectedId.toLowerCase().trim() === item.id.toLowerCase().trim() ||
              (item.slug && selectedId.toLowerCase().trim() === item.slug.toLowerCase().trim())
            );

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
                {/* Circular Professional Icon Container (96px desktop / 84px tablet / 64px mobile) */}
                <div className={`relative w-[64px] h-[64px] sm:w-[84px] sm:h-[84px] md:w-[96px] md:h-[96px] rounded-full flex items-center justify-center transition-all duration-300 ease-out group-hover:-translate-y-1 ${iconMeta.bg} ${iconMeta.border} border shadow-sm group-hover:shadow-md ${
                  isSelected
                    ? 'border-2 border-[#E50914] shadow-lg ring-4 ring-[#E50914]/20 scale-[1.04]'
                    : 'group-hover:border-[#E50914]/50'
                }`}>
                  {/* Subtle inner ambient ring */}
                  <div className="absolute inset-1.5 rounded-full border border-white/60 pointer-events-none" />

                  {/* Curated Vector Icon */}
                  <div className={`relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconMeta.text}`}>
                    <CuratedIcon 
                      className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 stroke-[2.2] drop-shadow-2xs" 
                    />
                  </div>

                  {/* Top-Right Check Mark Badge when Selected */}
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="absolute top-0 right-0 w-5 h-5 rounded-full bg-[#E50914] text-white flex items-center justify-center border-2 border-white shadow-xs z-10"
                    >
                      <Check size={11} strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                {/* Category Name (14px–15px font weight 800) */}
                <span className={`text-xs sm:text-sm md:text-[14px] font-extrabold mt-2.5 text-center leading-tight truncate max-w-full transition-colors ${
                  isSelected ? 'text-[#E50914]' : 'text-[#252525] group-hover:text-[#E50914]'
                }`}>
                  {item.title}
                </span>

                {/* Venue Count */}
                {item.count > 0 && (
                  <span className={`text-[11px] sm:text-xs font-bold mt-0.5 text-center truncate transition-colors ${
                    isSelected ? 'text-[#E50914]/80' : 'text-stone-400 group-hover:text-stone-600'
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
