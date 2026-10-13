'use client';

import { useSearchStore } from '@/stores/search.store';
import { X, SlidersHorizontal, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from './FilterSidebar';
import { useLanguage } from '@/context/LanguageContext';

export default function FilterDrawer({ isOpen, onClose, mode, bookingStats, activeTab, onTabChange, cafes = [] }) {
  const { t } = useLanguage();
  const { clearFilters } = useSearchStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={onClose}
          />
          
          {/* Slide-in Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="relative ml-auto flex h-full w-full max-w-xs sm:max-w-sm flex-col bg-white shadow-2xl z-10"
          >
            {/* Header with Clear All & Close Button */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-stone-100 bg-white">
              <h2 className="text-base font-black text-[#2C1810] flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#6F4E37]" />
                <span>{mode === 'profile' ? 'Profile Navigation' : mode === 'bookings' ? 'My Bookings Navigation' : 'Filters'}</span>
              </h2>

              <div className="flex items-center gap-2">
                {mode !== 'bookings' && mode !== 'profile' && (
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-rose-600 font-extrabold transition-colors bg-stone-50 hover:bg-rose-50 px-2.5 py-1 rounded-full border border-stone-200/80"
                  >
                    <Trash2 size={11} />
                    <span>Clear All</span>
                  </motion.button>
                )}

                <button 
                  type="button" 
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 p-1.5 text-stone-600 hover:bg-stone-200 active:scale-90 transition-all cursor-pointer"
                  onClick={onClose}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
              <FilterSidebar showHeader={false} showNavigation={false} mode={mode} bookingStats={bookingStats} activeTab={activeTab} onTabChange={(tabId) => { onTabChange && onTabChange(tabId); onClose(); }} cafes={cafes} />
            </div>

            {/* Mobile Footer Apply Button */}
            {mode !== 'bookings' && mode !== 'profile' && (
              <div className="p-3 border-t border-stone-100 bg-white shadow-lg flex gap-2">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 active:scale-95 transition-all"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-[2] py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5a3e2b] text-white text-xs font-black shadow-md shadow-[#6F4E37]/20 active:scale-95 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
