'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export default function ModernSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select Option',
  icon: Icon,
  className = '',
  error = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to { value, label, icon }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: String(opt), label: String(opt) };
    }
    return opt;
  });

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full select-none ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold text-[#2C1810] outline-none transition-all flex items-center justify-between cursor-pointer ${
          error
            ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-400/30'
            : isOpen
            ? 'border-[#6F4E37] bg-white ring-2 ring-[#6F4E37]/15 shadow-sm'
            : 'border-stone-200 bg-stone-50 hover:bg-white hover:border-[#6F4E37]/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && <Icon size={16} className={`shrink-0 ${isOpen ? 'text-[#6F4E37]' : 'text-stone-400'}`} />}
          <span className={selectedOption ? 'text-[#2C1810] font-black truncate' : 'text-stone-400 font-bold truncate'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`text-stone-400 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-[#6F4E37]' : ''
          }`}
        />
      </button>

      {/* Modern Popover Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-50 mt-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-[0_10px_30px_rgba(44,24,16,0.12)] p-1.5 overflow-hidden max-h-60 overflow-y-auto"
          >
            {normalizedOptions.map((option) => {
              const isSelected = String(option.value) === String(value);
              const OptionIcon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-sm font-black'
                      : 'text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    {OptionIcon && <OptionIcon size={14} className={isSelected ? 'text-white' : 'text-[#6F4E37]'} />}
                    <span className="truncate">{option.label}</span>
                  </div>
                  {isSelected && <Check size={16} className="text-white shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

