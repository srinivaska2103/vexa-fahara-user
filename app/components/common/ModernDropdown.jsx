'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export default function ModernDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select Option',
  icon: Icon,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format options if passed as simple string array
  const formattedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) return opt;
    return { value: opt, label: String(opt) };
  });

  const selectedOption = formattedOptions.find((opt) => opt.value === value);

  return (
    <div className={`relative w-full font-sans ${className}`} ref={dropdownRef}>
      {/* Custom Trigger Button */}
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white hover:bg-[#FFF8F0] border border-stone-200 hover:border-[#6F4E37]/60 py-2.5 sm:py-3 px-3.5 rounded-2xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/20 transition-all cursor-pointer shadow-2xs flex items-center justify-between group min-h-[44px]"
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {Icon && <Icon size={16} className="text-[#6F4E37] shrink-0 group-hover:scale-110 transition-transform" />}
          <span className="truncate text-stone-900 font-extrabold">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown 
          size={16} 
          className={`text-stone-400 group-hover:text-[#6F4E37] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#6F4E37]' : ''}`} 
        />
      </button>

      {/* Modern Popover Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-stone-200/90 shadow-2xl p-1.5 z-50 max-h-60 overflow-y-auto text-left scrollbar-thin scrollbar-thumb-stone-300"
          >
            <div className="space-y-0.5">
              {formattedOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-xs'
                        : 'text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <opt.icon size={15} className={isSelected ? 'text-amber-300' : 'text-[#6F4E37]'} />}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    {isSelected && <Check size={14} className="text-amber-300 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
