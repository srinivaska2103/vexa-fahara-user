'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Compass, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiscoveryCategorySection({
  title = "WHAT'S ON YOUR MIND?",
  subtitle = "Explore categories, dining styles & occasion venues",
  headerIcon: HeaderIcon = Compass,
  items = [],
  selectedId = '',
  onSelect,
  onClear,
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
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div suppressHydrationWarning className="mb-6 p-5 sm:p-6 bg-[#FFF9F3] rounded-[28px] border border-[#EBE0D5] shadow-xs relative overflow-hidden group/container">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4A2C11] text-[#DDB892] flex items-center justify-center font-bold shadow-xs shrink-0 border border-[#DDB892]/30">
            <HeaderIcon size={20} />
          </div>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight uppercase">
                {title}
              </h2>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#EFE5DB] text-[#6F4E37] border border-[#DDB892]/40 tracking-wider">
                {items.length} OPTIONS
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedId && onClear && (
            <motion.button 
              suppressHydrationWarning
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className="text-xs font-black text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 rounded-xl border border-rose-200/80 transition-all cursor-pointer mr-1 flex items-center gap-1 shadow-2xs"
            >
              <span>Clear Filter</span>
            </motion.button>
          )}

          {/* Desktop Navigation Scroll Arrows */}
          <div className="flex items-center gap-2">
            <button
              suppressHydrationWarning
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border shadow-2xs ${
                canScrollLeft 
                  ? 'bg-white hover:bg-[#6F4E37] text-[#2C1810] hover:text-white border-[#E5D7CA] cursor-pointer active:scale-95' 
                  : 'bg-stone-100/60 text-stone-300 border-stone-200/60 cursor-not-allowed opacity-40'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              suppressHydrationWarning
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border shadow-2xs ${
                canScrollRight 
                  ? 'bg-white hover:bg-[#6F4E37] text-[#2C1810] hover:text-white border-[#E5D7CA] cursor-pointer active:scale-95' 
                  : 'bg-stone-100/60 text-stone-300 border-stone-200/60 cursor-not-allowed opacity-40'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Category Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth relative z-10 select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedId && selectedId.toLowerCase().trim() === item.id.toLowerCase().trim();

          return (
            <motion.button
              key={item.id}
              suppressHydrationWarning
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect && onSelect(item.id)}
              className="flex flex-col items-center shrink-0 group cursor-pointer w-[80px] sm:w-[94px] transition-all"
            >
              {/* Pastel Circular Icon Container */}
              <div className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSelected
                  ? 'bg-white border-2 border-[#6F4E37] shadow-md ring-4 ring-[#6F4E37]/15 scale-105'
                  : `bg-gradient-to-br ${item.bg || 'from-stone-100 to-amber-50 text-[#6F4E37]'} border-2 border-transparent group-hover:border-[#6F4E37]/40 shadow-2xs group-hover:shadow-sm`
              }`}>
                <Icon size={24} className={`sm:w-7 sm:h-7 transition-transform duration-300 ${isSelected ? 'scale-110 text-[#6F4E37]' : 'group-hover:scale-110'}`} />

                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 w-5 h-5 rounded-full bg-[#6F4E37] text-white flex items-center justify-center border-2 border-white shadow-xs"
                  >
                    <Check size={11} strokeWidth={3} />
                  </motion.div>
                )}
              </div>

              {/* Title */}
              <span className={`text-xs font-black mt-2 text-center truncate max-w-full transition-colors ${
                isSelected ? 'text-[#6F4E37] font-extrabold' : 'text-[#2C1810] group-hover:text-[#6F4E37]'
              }`}>
                {item.title}
              </span>

              {/* Real Venue Count */}
              {item.count !== undefined && (
                <span className={`text-[11px] font-bold mt-0.5 text-center truncate transition-colors ${
                  isSelected ? 'text-[#6F4E37] font-extrabold' : 'text-stone-400 group-hover:text-stone-600'
                }`}>
                  {item.count} {item.count === 1 ? 'Venue' : 'Venues'}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
