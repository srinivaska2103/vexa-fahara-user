import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, Calendar, X } from 'lucide-react';
import { checkIfTimeWithinBusinessHours } from '@/lib/utils';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------
// Rolling Drum Wheel Column Sub-Component
// ----------------------------------------------------------------------
const DrumWheelColumn = ({ items, selectedValue, onSelect, label, formatDisplay, isDisabled }) => {
  const containerRef = useRef(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  // Sync scroll position with selected value
  useEffect(() => {
    if (containerRef.current && !isUserScrolling.current) {
      const index = items.findIndex((item) => item === selectedValue);
      if (index !== -1) {
        const itemHeight = 44;
        containerRef.current.scrollTo({
          top: index * itemHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedValue, items]);

  const handleScroll = (e) => {
    isUserScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    const itemHeight = 44;
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);

    if (items[index] && items[index] !== selectedValue) {
      onSelect(items[index]);
    }

    scrollTimeout.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 150);
  };

  const handleKeyDown = (e) => {
    const currentIndex = items.findIndex((item) => item === selectedValue);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(items.length - 1, currentIndex + 1);
      onSelect(items[nextIndex]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(0, currentIndex - 1);
      onSelect(items[prevIndex]);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center min-w-0">
      <span className="text-[10px] font-black uppercase text-[#7A706A] tracking-wider mb-2 select-none">
        {label}
      </span>
      <div 
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`Select ${label}`}
        className="relative h-[176px] w-full bg-white rounded-2xl border border-[#E8DED3] shadow-2xs overflow-hidden select-none outline-none focus:ring-2 focus:ring-[#6F4E37]/30"
      >
        {/* Top & Bottom 3D Gradient Fades */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Center Active Selection Window Highlight */}
        <div className="absolute inset-x-1.5 top-[66px] h-[44px] bg-[#E8DED3]/60 rounded-xl border border-[#DDB892]/70 pointer-events-none z-0 shadow-2xs" />

        {/* Wheel Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none py-[66px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => {
            const isSelected = item === selectedValue;
            const disabled = isDisabled ? isDisabled(item) : false;
            return (
              <div
                key={item}
                onClick={() => !disabled && onSelect(item)}
                className={`h-[44px] snap-center flex items-center justify-center font-black transition-all cursor-pointer ${
                  disabled
                    ? 'text-stone-300 line-through opacity-30 cursor-not-allowed'
                    : isSelected
                    ? 'text-[#2D2420] text-base sm:text-lg font-black scale-110'
                    : 'text-[#7A706A] opacity-40 text-xs sm:text-sm hover:opacity-80 scale-95'
                }`}
              >
                {formatDisplay ? formatDisplay(item) : item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main StartTimePicker Component
// ----------------------------------------------------------------------
export default function StartTimePicker({
  value = '12:00',
  onChange,
  cafe,
  selectedDate,
  label = 'Start Time',
  isLoading = false,
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const pickerId = useId();

  // Helper: Parse HH:MM 24h string into 12h object
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: '12', min: '00', ampm: 'PM' };
    let [h, m] = timeStr.split(':');
    h = parseInt(h || '12', 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return {
      hour: h.toString().padStart(2, '0'),
      min: m ? m.padStart(2, '0') : '00',
      ampm,
    };
  };

  const { hour, min, ampm } = parseTime(value);

  // Helper: Format 12h object to 24h string HH:MM
  const formatTo24h = (hStr, mStr, ampmStr) => {
    let h = parseInt(hStr, 10);
    if (ampmStr === 'PM' && h !== 12) h += 12;
    if (ampmStr === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${mStr}`;
  };

  // Display 12h text e.g. "12:00 PM"
  const formattedDisplay = `${hour}:${min} ${ampm}`;

  // Update time Handler
  const handleUpdate = (newHour, newMin, newAmpm) => {
    const time24 = formatTo24h(newHour, newMin, newAmpm);
    setValidationError('');
    if (onChange) {
      onChange({ target: { value: time24 } });
    }
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Generate Quick Slots based on business hours
  const generateQuickSlots = () => {
    const defaultSlots = [
      { label: '10:00 AM', h: '10', m: '00', mode: 'AM' },
      { label: '12:00 PM', h: '12', m: '00', mode: 'PM' },
      { label: '02:00 PM', h: '02', m: '00', mode: 'PM' },
      { label: '04:00 PM', h: '04', m: '00', mode: 'PM' },
      { label: '06:00 PM', h: '06', m: '00', mode: 'PM' },
      { label: '08:00 PM', h: '08', m: '00', mode: 'PM' },
    ];

    if (!cafe || !selectedDate) return defaultSlots;

    // Check operating hours
    const dateObj = new Date(selectedDate);
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayName = days[dateObj.getDay()];
    const hoursConfig = cafe.cafe_business_hours?.find((b) => b.day_of_week === dayName);

    if (!hoursConfig || hoursConfig.is_closed) {
      return [];
    }

    return defaultSlots.filter((slot) => {
      const time24 = formatTo24h(slot.h, slot.m, slot.mode);
      const validation = checkIfTimeWithinBusinessHours(cafe, selectedDate, time24, time24);
      return validation.isValid;
    });
  };

  const quickSlots = generateQuickSlots();
  const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutesList = ['00', '15', '30', '45'];
  const ampmList = ['AM', 'PM'];

  // Handle Confirm Click
  const handleConfirm = () => {
    const time24 = formatTo24h(hour, min, ampm);
    const validation = checkIfTimeWithinBusinessHours(cafe, selectedDate, time24, time24);

    if (cafe && selectedDate && !validation.isValid) {
      setValidationError(validation.message || 'The selected time is outside operating hours.');
      toast.error('The selected time slot is not available.', {
        style: { borderRadius: '12px', background: '#2D2420', color: '#fff' },
      });
      return;
    }

    setValidationError('');
    setIsOpen(false);
    toast.success(`Start time confirmed: ${formattedDisplay}`, {
      style: { borderRadius: '12px', background: '#6F4E37', color: '#fff' },
    });
    if (onClose) onClose();
  };

  return (
    <div className="w-full font-sans relative" id={pickerId}>
      {/* ------------------------------------------------------------------ */}
      {/* TOP SELECTED TIME DISPLAY BAR */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full bg-[#FAF7F2] border border-[#E8DED3] rounded-3xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs">
        {/* Selected Time Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-white border border-[#DDB892]/70 px-4 py-2 rounded-2xl shadow-2xs font-black text-sm sm:text-base text-[#2D2420] flex items-center gap-1.5">
            <span>{formattedDisplay}</span>
          </div>
        </div>

        {/* Change Action Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`${pickerId}-panel`}
          className="px-4 py-2 rounded-2xl bg-white border border-[#E8DED3] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
        >
          {isOpen ? 'Close' : 'Change'}
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* EXPANDABLE TIME SELECTOR PANEL */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${pickerId}-panel`}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mt-3 bg-[#FAF7F2] border border-[#E8DED3] rounded-3xl p-4 sm:p-6 shadow-[0_12px_36px_rgba(45,36,32,0.08)] space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DED3]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 flex items-center justify-center text-[#6F4E37]">
                  <Clock size={18} />
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#2D2420] tracking-tight">
                  Select {label}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 border border-[#E8DED3] text-[#7A706A] hover:text-[#2D2420] font-black text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Loading State Skeleton */}
            {isLoading ? (
              <div className="space-y-4 py-4 animate-pulse">
                <div className="h-4 bg-stone-200/80 rounded w-24" />
                <div className="flex gap-2">
                  <div className="h-9 bg-stone-200/80 rounded-xl w-20" />
                  <div className="h-9 bg-stone-200/80 rounded-xl w-20" />
                  <div className="h-9 bg-stone-200/80 rounded-xl w-20" />
                </div>
                <div className="h-44 bg-stone-200/80 rounded-2xl w-full" />
              </div>
            ) : (
              <>
                {/* -------------------------------------------------------- */}
                {/* QUICK SLOTS SECTION */}
                {/* -------------------------------------------------------- */}
                <div>
                  <span className="text-[10px] font-black uppercase text-[#7A706A] tracking-widest block mb-2">
                    Quick Slots
                  </span>

                  {quickSlots.length === 0 ? (
                    <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center gap-2.5 text-rose-800 text-xs font-bold">
                      <AlertCircle size={16} className="text-rose-500 shrink-0" />
                      <span>Venue is closed on this date. Please pick another date.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                      {quickSlots.map((slot) => {
                        const isSelected =
                          hour === slot.h && min === slot.m && ampm === slot.mode;
                        return (
                          <button
                            key={slot.label}
                            type="button"
                            onClick={() => handleUpdate(slot.h, slot.m, slot.mode)}
                            className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                              isSelected
                                ? 'bg-[#6F4E37] text-white shadow-xs scale-102'
                                : 'bg-white text-[#2D2420] hover:bg-[#FFF8F0] hover:text-[#6F4E37] border border-[#E8DED3]'
                            }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* -------------------------------------------------------- */}
                {/* 3-COLUMN ROLLING DRUM WHEEL TIME PICKER */}
                {/* -------------------------------------------------------- */}
                <div className="bg-[#FAF7F2] p-3.5 sm:p-4 rounded-3xl border border-[#E8DED3] shadow-inner">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Hours Wheel */}
                    <DrumWheelColumn
                      items={hoursList}
                      selectedValue={hour}
                      onSelect={(newH) => handleUpdate(newH, min, ampm)}
                      label="HOURS"
                    />

                    {/* Colon Separator */}
                    <div className="text-xl sm:text-2xl font-black text-[#6F4E37] self-center pb-2 select-none">
                      :
                    </div>

                    {/* Minutes Wheel */}
                    <DrumWheelColumn
                      items={minutesList}
                      selectedValue={min}
                      onSelect={(newM) => handleUpdate(hour, newM, ampm)}
                      label="MINUTES"
                      formatDisplay={(m) => `:${m}`}
                    />

                    {/* Period Wheel */}
                    <DrumWheelColumn
                      items={ampmList}
                      selectedValue={ampm}
                      onSelect={(newMode) => handleUpdate(hour, min, newMode)}
                      label="PERIOD"
                    />
                  </div>
                </div>

                {/* Validation Error Banner */}
                {validationError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-800 text-xs font-extrabold">
                    <AlertCircle size={16} className="text-rose-500 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* CONFIRM BUTTON */}
                {/* -------------------------------------------------------- */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full py-3.5 px-4 bg-[#6F4E37] hover:bg-[#4A2C1A] active:scale-[0.99] text-white text-xs sm:text-sm font-black rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={18} /> Confirm {label} ({formattedDisplay})
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
