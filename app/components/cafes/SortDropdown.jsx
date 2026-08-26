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
            className="flex items-center justify-between gap-2 bg-white border border-stone-200 text-[#2C1810] py-2 px-3 sm:px-4 rounded-xl shadow-2xs hover:border-[#6F4E37] focus:outline-none focus:ring-4 focus:ring-[#DDB892]/30 transition-all font-bold text-xs sm:text-sm"
          >
            <ArrowUpDown size={14} className="text-[#6F4E37]" />
            <span className="truncate max-w-[110px] sm:max-w-[140px]">{currentLabel}</span>
            <ChevronDown size={15} className={cn("text-stone-400 transition-transform duration-200", isOpen ? "rotate-180 text-[#6F4E37]" : "")} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 sm:left-auto sm:right-0 z-50 w-48 sm:w-52 max-w-[calc(100vw-32px)] mt-2 bg-white border border-stone-200 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden"
              >
                <ul className="py-1">
                  {options.map((opt) => (
                    <li key={opt.value}>
                      <button
                        onClick={() => {
                          setSortBy(opt.value);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-2.5 text-xs sm:text-sm transition-colors text-left",
                          sortBy === opt.value 
                            ? "bg-[#FFF8F0] text-[#6F4E37] font-extrabold" 
                            : "text-stone-700 hover:bg-stone-50 font-medium"
                        )}
                      >
                        <span className="truncate mr-2">{opt.label}</span>
                        {sortBy === opt.value && <Check size={15} className="text-[#6F4E37] flex-shrink-0" />}
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
