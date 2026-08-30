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
        <div className="fixed inset-0 z-50 flex lg:hidden">
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
            <div className="flex-1 overflow-y-auto p-4">
              <FilterSidebar showHeader={false} showNavigation={false} mode={mode} bookingStats={bookingStats} activeTab={activeTab} onTabChange={(tabId) => { onTabChange && onTabChange(tabId); onClose(); }} cafes={cafes} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
