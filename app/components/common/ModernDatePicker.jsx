'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, X, Check } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

export default function ModernDatePicker({
  value,
  onChange,
  placeholder = 'Select Date',
  minYear = 1940,
  maxYear = new Date().getFullYear(),
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('days'); // 'days' | 'month' | 'year'
  const containerRef = useRef(null);
  const yearListRef = useRef(null);

  // Parse current selected date or default to current date cleanly in local time
  const parseLocalDate = (val) => {
    if (!val) return null;
    if (typeof val === 'string' && val.includes('-')) {
      const parts = val.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return new Date(y, m, d);
        }
      }
    }
    const iso = parseISO(val);
    return isValid(iso) ? iso : null;
  };

  const parsedValue = parseLocalDate(value);
  const now = new Date();

  const [viewYear, setViewYear] = useState(parsedValue ? parsedValue.getFullYear() : now.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedValue ? parsedValue.getMonth() : now.getMonth());

  // Close popup & reset view mode when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setViewMode('days');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update view state when prop value changes
  useEffect(() => {
    if (parsedValue) {
      setViewYear(parsedValue.getFullYear());
      setViewMonth(parsedValue.getMonth());
    }
  }, [value]);

  // Scroll active year into view when year selector opens
  useEffect(() => {
    if (viewMode === 'year' && yearListRef.current) {
      const activeEl = yearListRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [viewMode]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (dayNumber) => {
    const yearStr = viewYear.toString();
    const monthStr = (viewMonth + 1).toString().padStart(2, '0');
    const dayStr = dayNumber.toString().padStart(2, '0');
    const formatted = `${yearStr}-${monthStr}-${dayStr}`;
    onChange(formatted);
    setIsOpen(false);
    setViewMode('days');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setViewMode('days');
  };

  const handleSetToday = () => {
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    onChange(formatted);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
    setViewMode('days');
  };

  // Days grid generation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonthDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1
  );
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

  const isSelected = (day) => {
    return (
      parsedValue &&
      parsedValue.getFullYear() === viewYear &&
      parsedValue.getMonth() === viewMonth &&
      parsedValue.getDate() === day
    );
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  };

  const displayDateText = parsedValue ? format(parsedValue, 'MMM dd, yyyy') : '';

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button Container */}
      <div
        role="button"
        tabIndex={0}
        suppressHydrationWarning
        onClick={() => {
          setIsOpen(!isOpen);
          setViewMode('days');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
            setViewMode('days');
          }
        }}
        className="relative w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl border border-stone-200 bg-white hover:border-[#6F4E37]/60 focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 outline-none text-xs sm:text-sm font-medium text-stone-800 transition-all flex items-center justify-between cursor-pointer shadow-2xs group min-h-[44px]"
      >
        <CalendarIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-[#6F4E37] transition-colors pointer-events-none" />
        
        <span className={`truncate ${displayDateText ? 'text-stone-900 font-bold' : 'text-stone-400 font-medium'}`}>
          {displayDateText || placeholder}
        </span>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {displayDateText && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  handleClear(e);
                }
              }}
              className="p-1 text-stone-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
              title="Clear date"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown size={16} className={`text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-[#6F4E37]' : ''}`} />
        </div>
      </div>

      {/* Modern Popover Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute left-0 sm:left-auto top-full z-[100] mt-2 w-full min-w-[280px] sm:min-w-[320px] max-w-[340px] bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-4 font-sans text-[#2C1810]"
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between gap-1 pb-3 mb-3 border-b border-stone-100">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={viewMode !== 'days'}
                className="p-1.5 rounded-xl text-stone-600 hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                title="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1.5">
                {/* Custom Month Selector Button */}
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'month' ? 'days' : 'month')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'month'
                      ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-md'
                      : 'bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60 hover:bg-[#F5EBE1]'
                  }`}
                >
                  <span>{months[viewMonth]}</span>
                  <ChevronDown size={14} className={viewMode === 'month' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>

                {/* Custom Year Selector Button */}
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'year' ? 'days' : 'year')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'year'
                      ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-md'
                      : 'bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60 hover:bg-[#F5EBE1]'
                  }`}
                >
                  <span>{viewYear}</span>
                  <ChevronDown size={14} className={viewMode === 'year' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={viewMode !== 'days'}
                className="p-1.5 rounded-xl text-stone-600 hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                title="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* VIEW MODE 1: CUSTOM MONTH SELECTOR GRID */}
            {viewMode === 'month' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-3 gap-2 py-2"
              >
                {months.map((m, idx) => {
                  const isCurrentMonth = viewMonth === idx;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setViewMonth(idx);
                        setViewMode('days');
                      }}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrentMonth
                          ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black shadow-md scale-105'
                          : 'bg-[#FFF8F0]/70 border border-stone-200/80 text-stone-800 hover:bg-[#6F4E37] hover:text-white hover:border-[#6F4E37]'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* VIEW MODE 2: CUSTOM YEAR SELECTOR GRID */}
            {viewMode === 'year' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                ref={yearListRef}
                className="grid grid-cols-3 gap-2 py-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-700/30"
              >
                {years.map((y) => {
                  const isCurrentYear = viewYear === y;
                  return (
                    <button
                      key={y}
                      type="button"
                      data-selected={isCurrentYear}
                      onClick={() => {
                        setViewYear(y);
                        setViewMode('month');
                      }}
                      className={`py-2 px-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrentYear
                          ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black shadow-md scale-105'
                          : 'bg-[#FFF8F0]/70 border border-stone-200/80 text-stone-800 hover:bg-[#6F4E37] hover:text-white hover:border-[#6F4E37]'
                      }`}
                    >
                      {y}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* VIEW MODE 3: DEFAULT DAYS CALENDAR GRID */}
            {viewMode === 'days' && (
              <>
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-[11px] font-black text-stone-400 uppercase tracking-wider py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {prevMonthDays.map((d) => (
                    <div key={`prev-${d}`} className="h-9 flex items-center justify-center text-xs font-medium text-stone-300 pointer-events-none select-none">
                      {d}
                    </div>
                  ))}

                  {currentMonthDays.map((d) => {
                    const active = isSelected(d);
                    const today = isToday(d);

                    return (
                      <button
                        key={`curr-${d}`}
                        type="button"
                        onClick={() => handleSelectDay(d)}
                        className={`h-9 w-full rounded-xl text-xs font-bold transition-all relative cursor-pointer flex items-center justify-center ${
                          active
                            ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black shadow-md scale-105 z-10'
                            : today
                            ? 'bg-[#FFF8F0] text-[#6F4E37] font-black border border-[#DDB892]/60'
                            : 'text-stone-800 hover:bg-stone-100 hover:text-[#6F4E37]'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}

                  {nextMonthDays.map((d) => (
                    <div key={`next-${d}`} className="h-9 flex items-center justify-center text-xs font-medium text-stone-300 pointer-events-none select-none">
                      {d}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Footer Bar */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-xs">
              <button
                type="button"
                onClick={handleSetToday}
                className="font-bold text-[#6F4E37] hover:underline cursor-pointer"
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setViewMode('days');
                }}
                className="px-3.5 py-1.5 bg-[#6F4E37] text-white font-black rounded-xl hover:bg-[#4A2C11] transition-colors cursor-pointer"
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
