import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, X, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { checkIfTimeWithinBusinessHours } from '@/lib/utils';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------
// Rolling Drum Wheel Column Sub-Component (Theme-Based Red & White)
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
      <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider mb-1.5 select-none">
        {label}
      </span>
      <div 
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`Select ${label}`}
        className="relative h-[176px] w-full bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden select-none outline-none focus:ring-2 focus:ring-[#E50914]/30"
      >
        {/* Top & Bottom Gradient Fades */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Center Active Selection Window Highlight (Theme-Based Red Border) */}
        <div className="absolute inset-x-1.5 top-[66px] h-[44px] bg-[#FFF5F5] rounded-xl border border-[#E50914] pointer-events-none z-0 shadow-2xs" />

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
                    ? 'text-[#E50914] text-base sm:text-lg font-black scale-110'
                    : 'text-stone-500 opacity-40 text-xs sm:text-sm hover:opacity-80 scale-95'
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
// Main StartTimePicker Component (Modern Popup Modal + Theme Colors)
// ----------------------------------------------------------------------
export default function StartTimePicker({
  value = '12:00',
  onChange,
  cafe,
  selectedDate,
  label = 'Start Time',
  isLoading = false,
  onClose,
  durationHours = 0,
  selectedEventCompany = null,
  blockedBlocks = [],
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

  // Helper: Compute end time 24h string given start 24h and duration in hours
  const computeEndTime24 = (start24, duration) => {
    if (!start24) return '13:00';
    const dur = Number(duration || 0);
    if (dur <= 0) return start24;
    const [h, m] = start24.split(':').map(Number);
    const totalMinutes = (h || 0) * 60 + (m || 0) + Math.round(dur * 60);
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = Math.floor(totalMinutes % 60);
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  // Helper: Format 24h string to 12h display string
  const format24to12 = (time24) => {
    if (!time24) return '';
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr || '12', 10);
    const mode = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h.toString().padStart(2, '0')}:${mStr || '00'} ${mode}`;
  };

  // Display 12h text e.g. "12:00 PM"
  const formattedDisplay = `${hour}:${min} ${ampm}`;

  // Calculated End Time display if duration is active
  const calculatedEndTime12 = durationHours > 0
    ? format24to12(computeEndTime24(formatTo24h(hour, min, ampm), durationHours))
    : null;

  // Check if a time interval [start24, end24] overlaps with any blocked block
  const checkBlockConflict = (start24, end24) => {
    if (!selectedDate || !start24 || !end24 || !blockedBlocks?.length) return null;
    try {
      const [bY, bM, bD] = selectedDate.split('-');
      const [sH, sMin] = start24.split(':');
      const [eH, eMin] = end24.split(':');
      const startReq = new Date(Date.UTC(parseInt(bY, 10), parseInt(bM, 10) - 1, parseInt(bD, 10), parseInt(sH, 10), parseInt(sMin, 10), 0));
      const endReq = new Date(Date.UTC(parseInt(bY, 10), parseInt(bM, 10) - 1, parseInt(bD, 10), parseInt(eH, 10), parseInt(eMin, 10), 0));
      return blockedBlocks.find((b) => {
        const bStart = new Date(b.start_at || b.startAt);
        const bEnd = new Date(b.end_at || b.endAt);
        return startReq < bEnd && endReq > bStart;
      });
    } catch {
      return null;
    }
  };

  // Update time Handler
  const handleUpdate = (newHour, newMin, newAmpm) => {
    const time24 = formatTo24h(newHour, newMin, newAmpm);
    setValidationError('');
    if (onChange) {
      onChange({ target: { value: time24 } });
    }
  };

  // Close on Escape
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

  // Generate Quick Slots based on business hours and package duration
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

    const dateObj = new Date(selectedDate);
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayName = days[dateObj.getDay()];
    const hoursConfig = cafe.cafe_business_hours?.find((b) => b.day_of_week === dayName);

    if (!hoursConfig || hoursConfig.is_closed) {
      return [];
    }

    return defaultSlots.filter((slot) => {
      const time24 = formatTo24h(slot.h, slot.m, slot.mode);
      const calculatedEnd = durationHours > 0 ? computeEndTime24(time24, durationHours) : time24;
      const validation = checkIfTimeWithinBusinessHours(cafe, selectedDate, time24, calculatedEnd, selectedEventCompany);
      if (!validation.isValid) return false;
      const conflict = checkBlockConflict(time24, calculatedEnd);
      return !conflict;
    });
  };

  const quickSlots = generateQuickSlots();
  const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutesList = ['00', '15', '30', '45'];
  const ampmList = ['AM', 'PM'];

  // Current live validation status for the selected time
  const currentValidation = (() => {
    const time24 = formatTo24h(hour, min, ampm);
    const calculatedEnd = durationHours > 0 ? computeEndTime24(time24, durationHours) : time24;
    return checkIfTimeWithinBusinessHours(cafe, selectedDate, time24, calculatedEnd, selectedEventCompany);
  })();

  const currentConflict = (() => {
    const time24 = formatTo24h(hour, min, ampm);
    const calculatedEnd = durationHours > 0 ? computeEndTime24(time24, durationHours) : time24;
    return checkBlockConflict(time24, calculatedEnd);
  })();

  // Handle Confirm Click
  const handleConfirm = () => {
    const time24 = formatTo24h(hour, min, ampm);
    const calculatedEnd = durationHours > 0 ? computeEndTime24(time24, durationHours) : time24;
    const validation = checkIfTimeWithinBusinessHours(cafe, selectedDate, time24, calculatedEnd, selectedEventCompany);

    if (cafe && selectedDate && !validation.isValid) {
      const errMsg = durationHours > 0
        ? `This event package is ${durationHours} hour(s). Ending at ${format24to12(calculatedEnd)} is outside operating hours (${validation.openTimeFormatted} - ${validation.closeTimeFormatted}).`
        : (validation.message || 'The selected time is outside operating hours.');
      setValidationError(errMsg);
      toast.error(errMsg, {
        style: { borderRadius: '12px', background: '#252525', color: '#fff' },
      });
      return;
    }

    const blockConflict = checkBlockConflict(time24, calculatedEnd);
    if (blockConflict) {
      const errMsg = `This ${durationHours > 0 ? `${durationHours}-hour ` : ''}time slot conflicts with a scheduled venue block (${blockConflict.reason || 'Reserved'}). Please choose another time.`;
      setValidationError(errMsg);
      toast.error(errMsg, {
        style: { borderRadius: '12px', background: '#252525', color: '#fff' },
      });
      return;
    }

    setValidationError('');
    setIsOpen(false);
    const endDisplay = durationHours > 0 ? ` (Ends at ${format24to12(calculatedEnd)})` : '';
    toast.success(`Time confirmed: ${formattedDisplay}${endDisplay}`, {
      style: { borderRadius: '12px', background: '#E50914', color: '#fff' },
    });
    if (onClose) onClose();
  };

  // Up/Down adjustments
  const stepHour = (delta) => {
    let currentH = parseInt(hour, 10);
    let nextH = currentH + delta;
    if (nextH > 12) nextH = 1;
    if (nextH < 1) nextH = 12;
    handleUpdate(nextH.toString().padStart(2, '0'), min, ampm);
  };

  const stepMin = (delta) => {
    const mins = ['00', '15', '30', '45'];
    let idx = mins.indexOf(min);
    if (idx === -1) idx = 0;
    let nextIdx = (idx + delta + mins.length) % mins.length;
    handleUpdate(hour, mins[nextIdx], ampm);
  };

  return (
    <div className="w-full font-sans relative" id={pickerId}>
      {/* ------------------------------------------------------------------ */}
      {/* MODERN THEME TRIGGER BUTTON (Compact, clean, responsive)           */}
      {/* ------------------------------------------------------------------ */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between bg-stone-50/90 hover:bg-white border border-stone-200/90 hover:border-[#EF5350] rounded-2xl px-3.5 sm:px-4 h-[46px] sm:h-[50px] transition-all shadow-2xs hover:shadow-xs cursor-pointer group text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] flex items-center justify-center text-[#E50914] shrink-0 group-hover:scale-105 transition-transform">
            <Clock size={15} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider truncate">
              {label}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-[#252525] truncate">
                {formattedDisplay}
              </span>
              {durationHours > 0 && (
                <span className="text-[10px] font-black text-[#E50914] bg-[#FFF5F5] px-1.5 py-0.2 rounded border border-[#FEE2E2] shrink-0">
                  {durationHours}h
                </span>
              )}
            </div>
          </div>
        </div>

        <span className="text-[11px] sm:text-xs font-black text-[#E50914] bg-[#FFF5F5] px-2.5 sm:px-3 py-1 rounded-xl border border-[#FEE2E2] group-hover:bg-[#E50914] group-hover:text-white transition-all shrink-0 shadow-2xs">
          Change
        </span>
      </button>

      {/* ------------------------------------------------------------------ */}
      {/* MODERN POPUP MODAL (Theme-Based Red & White, Responsive Mobile/Desktop) */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative z-10 w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-3xl border border-stone-200 shadow-2xl p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto"
            >
              {/* Mobile Swipe Grab Bar */}
              <div className="sm:hidden flex justify-center pb-1">
                <div className="w-12 h-1.5 bg-stone-200 rounded-full" />
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] flex items-center justify-center text-[#E50914] shadow-2xs">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#1E1E1E] tracking-tight">
                      Select {label}
                    </h3>
                    <p className="text-[11px] font-bold text-stone-400">
                      {durationHours > 0 ? `${durationHours} Hours Event Package Window` : 'Choose your visit start time'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onClose) onClose();
                  }}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Quick Slots Section */}
              <div>
                <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block mb-2">
                  Quick Preset Times
                </span>

                {quickSlots.length === 0 ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-800 text-xs font-bold">
                    <AlertCircle size={15} className="text-rose-500 shrink-0" />
                    <span>No quick slots available within operating hours.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                    {quickSlots.map((slot) => {
                      const isSelected = hour === slot.h && min === slot.m && ampm === slot.mode;
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          onClick={() => handleUpdate(slot.h, slot.m, slot.mode)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                            isSelected
                              ? 'bg-[#E50914] text-white shadow-xs scale-102 ring-2 ring-[#E50914]/30'
                              : 'bg-stone-50 hover:bg-[#FFF5F5] text-stone-700 hover:text-[#E50914] border border-stone-200 hover:border-[#EF5350]'
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3-Column Interactive Rolling Drum Wheel Picker */}
              <div className="bg-stone-50/80 p-3 sm:p-4 rounded-3xl border border-stone-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Hours Wheel */}
                  <DrumWheelColumn
                    items={hoursList}
                    selectedValue={hour}
                    onSelect={(newH) => handleUpdate(newH, min, ampm)}
                    label="HOURS"
                  />

                  {/* Colon Separator */}
                  <div className="text-xl sm:text-2xl font-black text-[#E50914] self-center pb-2 select-none">
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

              {/* Duration & Operating Hours Status Preview */}
              {durationHours > 0 && calculatedEndTime12 && (
                <div className="p-3 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] flex items-center justify-between text-xs font-black">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#E50914]" />
                    <span className="text-stone-700">
                      Calculated End: <strong className="text-[#1E1E1E]">{calculatedEndTime12}</strong> ({durationHours}h)
                    </span>
                  </div>
                  {currentValidation.isValid && !currentConflict ? (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Valid
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                      <AlertCircle size={11} /> Out of hours
                    </span>
                  )}
                </div>
              )}

              {/* Validation Error Alert */}
              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-800 text-xs font-bold leading-snug">
                  <AlertCircle size={15} className="text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onClose) onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-black text-xs transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-[2] py-3.5 px-4 bg-gradient-to-r from-[#B80012] via-[#ED0014] to-[#B80012] hover:from-[#9E0010] hover:to-[#9E0010] active:scale-[0.99] text-white text-xs sm:text-sm font-black rounded-2xl shadow-md shadow-[#ED0014]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={16} /> Confirm Time ({formattedDisplay})
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
