'use client';

import { Search, X, Coffee, ArrowRight } from 'lucide-react';
import { useSearchStore } from '@/stores/search.store';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function SearchBar() {
  const { t } = useLanguage();
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const setCategory = useSearchStore((state) => state.setCategory);
  
  const [localQuery, setLocalQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  // Popular quick tags
  const popularSearches = [
    { label: 'Live Music', type: 'category', value: 'Live Music' },
    { label: 'Date Night', type: 'category', value: 'Date Night' },
    { label: 'Corporate', type: 'category', value: 'Corporate' },
    { label: 'Birthday Party', type: 'category', value: 'Birthday Party' },
  ];

  // Debounce search query update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== query) setQuery(localQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [localQuery, query, setQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (value, type = 'query') => {
    if (type === 'category') {
      setCategory(value);
      setLocalQuery('');
    } else {
      setLocalQuery(value);
      setQuery(value);
    }
    setIsFocused(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full group">
      <motion.div 
        animate={{ scale: isFocused ? 1.01 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative flex items-center w-full"
      >
        {/* Crisp, high-visibility search icon */}
        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10 text-[#6F4E37]">
          <Search size={18} className="stroke-[2.5]" />
        </div>
        
        <input
          type="text"
          placeholder={t('searchPlaceholder', 'Search cafes, locations, or vibes...')}
          className="w-full pl-9 sm:pl-11 pr-8 sm:pr-9 py-2.5 sm:py-3 bg-stone-50/90 hover:bg-white focus:bg-white border border-stone-200 rounded-2xl shadow-2xs focus:outline-none focus:border-[#6F4E37] focus:ring-4 focus:ring-[#DDB892]/30 transition-all duration-300 text-xs sm:text-sm text-[#2C1810] placeholder:text-stone-400 font-semibold"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          suppressHydrationWarning
        />

        <AnimatePresence>
          {localQuery && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => {
                setLocalQuery('');
                setQuery('');
              }}
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 bg-stone-200/60 hover:bg-stone-200 p-1 rounded-full transition-colors z-10"
            >
              <X size={13} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Suggestion Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-[0_12px_40px_rgba(0,0,0,0.15)] p-3.5 z-50 backdrop-blur-xl font-sans"
          >
            <div className="text-[10px] sm:text-[11px] font-black uppercase text-stone-400 tracking-wider mb-2 px-1">
              Popular Vibes
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-2">
              {popularSearches.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleSelectSuggestion(item.value, item.type)}
                  className="px-2.5 py-1 rounded-xl bg-[#FFF8F0] border border-[#DDB892]/40 text-[#6F4E37] text-xs font-bold hover:bg-[#6F4E37] hover:text-white transition-all flex items-center gap-1 active:scale-95"
                >
                  <Coffee size={12} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {localQuery && (
              <div className="pt-2 border-t border-stone-100">
                <button 
                  onClick={() => setIsFocused(false)}
                  className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-stone-50 text-xs font-bold text-[#6F4E37]"
                >
                  <span className="truncate">Search for &ldquo;{localQuery}&rdquo;</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
