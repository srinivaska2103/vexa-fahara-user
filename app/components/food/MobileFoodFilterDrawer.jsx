'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  SlidersHorizontal, 
  Store, 
  Bike, 
  ShoppingBag, 
  Tags, 
  MapPin, 
  Check, 
  RotateCcw 
} from 'lucide-react';

export default function MobileFoodFilterDrawer({
  isOpen,
  onClose,
  filterFulfilment = 'ALL',
  onFilterFulfilmentChange = () => {},
  selectedCity = 'All Locations',
  onCityChange = () => {},
  availableCities = [],
  selectedCategory = 'all',
  onCategoryChange = () => {},
  categories = [],
  totalRestaurants = 0
}) {
  const fulfilmentOptions = [
    { id: 'ALL', label: 'All Restaurants', icon: Store, desc: 'Browse all available venues' },
    { id: 'DELIVERY', label: 'Delivery Available', icon: Bike, desc: 'Doorstep quick delivery' },
    { id: 'TAKEAWAY', label: 'Takeaway Available', icon: ShoppingBag, desc: 'Pick up fresh at counter' },
    { id: 'OFFERS', label: 'Special Offers', icon: Tags, desc: 'Discounts & hot deals' },
  ];

  const handleReset = () => {
    onFilterFulfilmentChange('ALL');
    onCityChange('All Locations');
    onCategoryChange('all');
  };

  const hasActiveFilters = 
    filterFulfilment !== 'ALL' || 
    selectedCity !== 'All Locations' || 
    selectedCategory !== 'all';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="relative mt-auto w-full bg-white rounded-t-[32px] shadow-2xl z-10 max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Grabber Bar */}
            <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mt-3 mb-1" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center border border-red-100">
                  <SlidersHorizontal size={15} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#252525]">Filters</h3>
                  <p className="text-[10px] text-stone-500 font-medium">Refine restaurants & fulfilment</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-[11px] font-black text-[#E50914] bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full transition-colors"
                  >
                    <RotateCcw size={11} />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* 1. Fulfilment Type */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-400 block">
                  Fulfilment Method
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {fulfilmentOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = filterFulfilment === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => onFilterFulfilmentChange(opt.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#FFF5F5] border-[#E50914] shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-[#E50914] text-white' : 'bg-stone-100 text-stone-600'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <span className={`text-xs font-black block ${
                              isSelected ? 'text-[#E50914]' : 'text-[#252525]'
                            }`}>
                              {opt.label}
                            </span>
                            <span className="text-[10px] text-stone-500 font-medium">
                              {opt.desc}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#E50914] text-white flex items-center justify-center">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Location / City */}
              {availableCities.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-400 block">
                    Location / City
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onCityChange('All Locations')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedCity === 'All Locations'
                          ? 'bg-[#E50914] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      All Locations
                    </button>
                    {availableCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => onCityChange(city)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          selectedCity === city
                            ? 'bg-[#E50914] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        <MapPin size={12} />
                        <span>{city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Category / Cuisine */}
              {categories.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-400 block">
                    Menu Categories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => onCategoryChange(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-[#E50914] text-white shadow-xs'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Apply Action Button */}
            <div className="p-4 border-t border-stone-100 bg-white">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#E50914] hover:bg-[#c90812] text-white font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>View {totalRestaurants} Restaurants</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

