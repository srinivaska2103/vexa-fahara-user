'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, X, Check, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function ModernPickupDateTimeModal({
  isOpen,
  onClose,
  initialDate,
  initialTime,
  onConfirm,
  prepTimeMinutes = 20
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState(initialTime || '12:30 PM');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Custom Time Wheel State
  const [customHour, setCustomHour] = useState('12');
  const [customMinute, setCustomMinute] = useState('30');
  const [customPeriod, setCustomPeriod] = useState('PM');

  // Month navigation for visual calendar
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = initialDate ? new Date(initialDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialDate) setSelectedDate(initialDate);
    if (initialTime) {
      setSelectedTime(initialTime);
      // Try to parse initialTime if in 'hh:mm AM/PM' format
      const match = initialTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (match) {
        setCustomHour(match[1].padStart(2, '0'));
        setCustomMinute(match[2]);
        if (match[3]) setCustomPeriod(match[3].toUpperCase());
      }
    }
  }, [initialDate, initialTime]);

  // Generate calendar days for current month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Preset pickup time slot pills
  const availableSlots = [
    'As soon as ready (~20m)',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM'
  ];

  const hoursList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutesList = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  const handleCustomTimeApply = (h = customHour, m = customMinute, p = customPeriod) => {
    const formatted = `${h}:${m} ${p}`;
    setSelectedTime(formatted);
  };

  const handleApply = () => {
    onConfirm({ date: selectedDate, time: selectedTime });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-[#FFF5F5]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E50914] text-white flex items-center justify-center shadow-xs">
              <CalendarIcon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#252525]">Select Pickup Schedule</h3>
              <p className="text-[11px] text-[#757575] font-medium">Estimated preparation ~{prepTimeMinutes} mins</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 flex items-center justify-center text-[#757575] hover:text-[#252525] border border-stone-200/80 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* 1. Date Picker Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#252525]">
                {monthNames[month]} {year}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl hover:bg-stone-100 text-[#757575] hover:text-[#252525] transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl hover:bg-stone-100 text-[#757575] hover:text-[#252525] transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-[#888888] uppercase">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const isToday = new Date().toISOString().slice(0, 10) === dateStr;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-8 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#E50914] text-white shadow-xs scale-105'
                        : isToday
                        ? 'bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]'
                        : 'hover:bg-stone-100 text-[#252525]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pickup Time Slots */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#252525]">
                <Clock size={14} className="text-[#E50914]" />
                <span>Select Time Slot</span>
              </div>

              {/* Custom Time Toggle */}
              <button
                type="button"
                onClick={() => {
                  const nextMode = !isCustomMode;
                  setIsCustomMode(nextMode);
                  if (nextMode) {
                    handleCustomTimeApply(customHour, customMinute, customPeriod);
                  }
                }}
                className={`text-[11px] font-black px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCustomMode 
                    ? 'bg-[#E50914] text-white shadow-sm' 
                    : 'bg-stone-100 hover:bg-[#FFF5F5] text-[#666666] hover:text-[#E50914] border border-stone-200/60'
                }`}
              >
                <SlidersHorizontal size={12} />
                <span>{isCustomMode ? 'Show Presets' : 'Custom Time'}</span>
              </button>
            </div>

            {/* Custom Modern Time Picker Wheels */}
            {isCustomMode ? (
              <div className="p-4 rounded-3xl bg-gradient-to-b from-[#FFF5F5] to-white border border-[#FEE2E2] shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#252525] uppercase tracking-wider">
                    Select Exact Hour &amp; Minute
                  </span>
                  <span className="text-xs font-black text-[#E50914] bg-white px-2.5 py-0.5 rounded-full border border-red-200 shadow-2xs">
                    {customHour}:{customMinute} {customPeriod}
                  </span>
                </div>

                {/* Modern Triple Column Scroller / Selector */}
                <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-2xl border border-red-100/80 shadow-2xs">
                  {/* Hours Column */}
                  <div className="space-y-1 text-center">
                    <span className="text-[9px] font-black text-[#999999] uppercase tracking-wider block">Hour</span>
                    <div className="max-h-36 overflow-y-auto space-y-1 pr-0.5 no-scrollbar">
                      {hoursList.map((h) => {
                        const isHSelected = customHour === h;
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => {
                              setCustomHour(h);
                              handleCustomTimeApply(h, customMinute, customPeriod);
                            }}
                            className={`w-full py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              isHSelected
                                ? 'bg-[#E50914] text-white shadow-xs'
                                : 'text-[#252525] hover:bg-stone-100'
                            }`}
                          >
                            {h}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Minutes Column */}
                  <div className="space-y-1 text-center border-x border-stone-100 px-1">
                    <span className="text-[9px] font-black text-[#999999] uppercase tracking-wider block">Minute</span>
                    <div className="max-h-36 overflow-y-auto space-y-1 pr-0.5 no-scrollbar">
                      {minutesList.map((m) => {
                        const isMSelected = customMinute === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setCustomMinute(m);
                              handleCustomTimeApply(customHour, m, customPeriod);
                            }}
                            className={`w-full py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              isMSelected
                                ? 'bg-[#E50914] text-white shadow-xs'
                                : 'text-[#252525] hover:bg-stone-100'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* AM / PM Column */}
                  <div className="space-y-1 text-center">
                    <span className="text-[9px] font-black text-[#999999] uppercase tracking-wider block">Period</span>
                    <div className="flex flex-col gap-2 pt-2">
                      {['AM', 'PM'].map((p) => {
                        const isPSelected = customPeriod === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setCustomPeriod(p);
                              handleCustomTimeApply(customHour, customMinute, p);
                            }}
                            className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              isPSelected
                                ? 'bg-[#E50914] text-white shadow-xs'
                                : 'bg-stone-50 hover:bg-stone-100 text-[#252525] border border-stone-200/60'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-center font-bold text-[#757575]">
                  Time selected: <strong className="text-[#E50914]">{customHour}:{customMinute} {customPeriod}</strong>
                </div>
              </div>
            ) : (
              /* Preset Slot Pills */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-black transition-all text-center truncate cursor-pointer ${
                        isSelected
                          ? 'bg-[#E50914] text-white shadow-xs'
                          : 'bg-stone-50 hover:bg-[#FFF5F5] text-[#666666] border border-stone-200/80 hover:border-[#E50914]/40 hover:text-[#E50914]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-[10px] font-bold text-[#888888] block">Selected Slot:</span>
            <span className="font-black text-[#252525]">{selectedDate} • {selectedTime}</span>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>Apply Slot</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}
