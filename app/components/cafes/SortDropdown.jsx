'use client';

import { useSearchStore } from '@/stores/search.store';
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function SortDropdown() {
  const { t } = useLanguage();
  const sortBy = useSearchStore((state) => state.sortBy);
  const setSortBy = useSearchStore((state) => state.setSortBy);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'popularity', label: t('popularity', 'Popularity') },
    { value: 'highest_rated', label: t('ratingHighToLow', 'Highest Rated') },
    { value: 'lowest_price', label: t('priceLowToHigh', 'Price: Low to High') },
    { value: 'highest_price', label: t('priceHighToLow', 'Price: High to Low') },
    { value: 'nearest', label: 'Nearest' },
    { value: 'newest', label: 'Newest' },
  ];

  const currentOption = options.find((o) => o.value === sortBy);
  const currentLabel = currentOption ? currentOption.label : t('popularity', 'Popularity');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-40 inline-block text-left" ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        <span className="text-xs sm:text-sm text-stone-500 font-bold hidden sm:inline flex-shrink-0">
          {t('sortBy', 'Sort by:')}
        </span>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center justify-between gap-2 bg-white border text-[#2C1810] py-2 px-3 sm:px-4 rounded-xl shadow-2xs transition-all font-extrabold text-xs sm:text-sm cursor-pointer select-none w-40 sm:w-48",
              isOpen 
                ? "border-[#6F4E37] ring-2 ring-[#6F4E37]/15 bg-[#FFF8F0]/40" 
                : "border-stone-200/90 hover:border-[#6F4E37]"
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowUpDown size={14} className="text-[#6F4E37] shrink-0" />
              <span className="truncate">{currentLabel}</span>
            </div>
            <ChevronDown size={15} className={cn("text-stone-400 transition-transform duration-200 shrink-0", isOpen ? "rotate-180 text-[#6F4E37]" : "")} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-[100] w-full min-w-[170px] bg-white border border-stone-200/90 rounded-2xl shadow-xl p-1.5 space-y-1 origin-top-right overflow-hidden"
              >
                <ul className="space-y-0.5">
                  {options.map((opt) => (
                    <li key={opt.value}>
                      <button
                        onClick={() => {
                          setSortBy(opt.value);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors text-left cursor-pointer",
                          sortBy === opt.value 
                            ? "bg-[#FFF8F0] text-[#6F4E37] font-black" 
                            : "text-stone-700 hover:bg-stone-50 hover:text-[#2C1810] font-semibold"
                        )}
                      >
                        <span className="truncate mr-2">{opt.label}</span>
                        {sortBy === opt.value && <Check size={14} className="text-[#6F4E37] shrink-0 stroke-[3]" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
