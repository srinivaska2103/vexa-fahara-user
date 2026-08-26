'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, X, Check } from 'lucide-react';

export default function ModernTimePicker({
  value,
  onChange,
  placeholder = 'Select Time',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Helper to parse 24h 'HH:mm' string or default
  const parseTime = (val) => {
    if (!val || typeof val !== 'string') return { hour: '09', minute: '00', period: 'AM' };
    const clean = val.trim();
    if (clean.includes(':')) {
      const parts = clean.split(':');
      let h = parseInt(parts[0], 10);
      let m = parseInt(parts[1], 10);
      if (isNaN(h)) h = 9;
      if (isNaN(m)) m = 0;

      const period = h >= 12 ? 'PM' : 'AM';
      let displayH = h % 12;
      if (displayH === 0) displayH = 12;

      return {
        hour: displayH.toString().padStart(2, '0'),
        minute: (Math.round(m / 5) * 5 % 60).toString().padStart(2, '0'),
        period,
      };
    }
    return { hour: '09', minute: '00', period: 'AM' };
  };

  const initialParsed = parseTime(value);
  const [selectedHour, setSelectedHour] = useState(initialParsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialParsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialParsed.period);

  useEffect(() => {
    if (value) {
      const parsed = parseTime(value);
      setSelectedHour(parsed.hour);
      setSelectedMinute(parsed.minute);
      setSelectedPeriod(parsed.period);
    }
  }, [value]);

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

  // Format internal state to 24h 'HH:mm' string for onChange
  const emitChange = (h, m, p) => {
    let hourNum = parseInt(h, 10);
    if (p === 'PM' && hourNum < 12) hourNum += 12;
    if (p === 'AM' && hourNum === 12) hourNum = 0;
    const formatted = `${hourNum.toString().padStart(2, '0')}:${m}`;
    onChange(formatted);
  };

  const handleSelectTime = (h, m, p) => {
    setSelectedHour(h);
    setSelectedMinute(m);
    setSelectedPeriod(p);
    emitChange(h, m, p);
  };

  const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutesList = ['00', '15', '30', '45'];

  const quickSlots = [
    { label: '09:00 AM', h: '09', m: '00', p: 'AM' },
    { label: '11:00 AM', h: '11', m: '00', p: 'AM' },
    { label: '01:00 PM', h: '01', m: '00', p: 'PM' },
    { label: '03:00 PM', h: '03', m: '00', p: 'PM' },
    { label: '05:00 PM', h: '05', m: '00', p: 'PM' },
    { label: '07:00 PM', h: '07', m: '00', p: 'PM' },
  ];

  const displayTimeText = value ? `${selectedHour}:${selectedMinute} ${selectedPeriod}` : '';

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="relative w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl border border-stone-200 bg-white hover:border-[#6F4E37]/60 focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 outline-none text-xs sm:text-sm font-medium text-stone-800 transition-all flex items-center justify-between cursor-pointer shadow-2xs group min-h-[44px]"
      >
        <Clock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-[#6F4E37] transition-colors pointer-events-none" />

        <span className={`truncate ${displayTimeText ? 'text-stone-900 font-bold' : 'text-stone-400 font-medium'}`}>
          {displayTimeText || placeholder}
        </span>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {displayTimeText && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setIsOpen(false);
              }}
              className="p-1 text-stone-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
              title="Clear time"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown size={16} className={`text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-[#6F4E37]' : ''}`} />
        </div>
      </div>

      {/* Animated Time Picker Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute left-0 top-full z-[100] mt-2 w-full min-w-[280px] sm:min-w-[320px] max-w-[340px] bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-4 font-sans text-[#2C1810]"
          >
            {/* AM / PM Segmented Control Header */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100">
              <span className="text-xs font-black uppercase tracking-wider text-stone-400">Select Time</span>
              <div className="flex items-center bg-[#FFF8F0] p-1 rounded-2xl border border-[#DDB892]/40">
                <button
                  type="button"
                  onClick={() => handleSelectTime(selectedHour, selectedMinute, 'AM')}
                  className={`px-3 py-1 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    selectedPeriod === 'AM'
                      ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-sm'
                      : 'text-stone-600 hover:text-[#6F4E37]'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTime(selectedHour, selectedMinute, 'PM')}
                  className={`px-3 py-1 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    selectedPeriod === 'PM'
                      ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-sm'
                      : 'text-stone-600 hover:text-[#6F4E37]'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Quick Time Chips */}
            <div className="mb-3">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block mb-1.5">Popular Slots</span>
              <div className="flex flex-wrap gap-1.5">
                {quickSlots.map((slot) => {
                  const isMatch =
                    selectedHour === slot.h &&
                    selectedMinute === slot.m &&
                    selectedPeriod === slot.p;
                  return (
                    <button
                      key={slot.label}
                      type="button"
                      onClick={() => handleSelectTime(slot.h, slot.m, slot.p)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isMatch
                          ? 'bg-[#6F4E37] text-white font-black shadow-xs'
                          : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] hover:border-[#DDB892]'
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hours and Minutes Columns */}
            <div className="grid grid-cols-2 gap-3 py-1 bg-[#FFF8F0]/40 p-2.5 rounded-2xl border border-stone-100">
              {/* Hour Selection */}
              <div>
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block mb-1 text-center">Hour</span>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-amber-700/30">
                  {hoursList.map((h) => {
                    const active = selectedHour === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleSelectTime(h, selectedMinute, selectedPeriod)}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          active
                            ? 'bg-[#6F4E37] text-white font-black shadow-xs'
                            : 'text-stone-700 hover:bg-white hover:text-[#6F4E37]'
                        }`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minute Selection */}
              <div>
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block mb-1 text-center">Minute</span>
                <div className="max-h-36 overflow-y-auto space-y-1 pl-1 scrollbar-thin scrollbar-thumb-amber-700/30">
                  {minutesList.map((m) => {
                    const active = selectedMinute === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectTime(selectedHour, m, selectedPeriod)}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          active
                            ? 'bg-[#6F4E37] text-white font-black shadow-xs'
                            : 'text-stone-700 hover:bg-white hover:text-[#6F4E37]'
                        }`}
                      >
                        :{m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-xs">
              <span className="font-bold text-[#6F4E37] text-xs">
                {selectedHour}:{selectedMinute} {selectedPeriod}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-[#6F4E37] text-white font-black rounded-xl hover:bg-[#4A2C11] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
