import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MessageSquare, Tag, CheckCircle2, AlertCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { useBookingStore } from '@/stores/booking.store';
import { useParams } from 'next/navigation';
import { useCafeDetails } from '@/hooks/useCafeDetails';
import { checkIfCafeClosedOnDate, checkIfTimeWithinBusinessHours } from '@/lib/utils';
import toast from 'react-hot-toast';
import StartTimePicker from './StartTimePicker';

// Custom Modern Interactive Date Picker Component
const CustomDatePicker = ({ value, onChange, label, cafe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDateString = (year, month, day) => {
    const y = year;
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDisplayDate = (val) => {
    if (!val) return 'Select Date';
    if (typeof val === 'string' && val.includes('-')) {
      const parts = val.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
    return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formattedDisplay = getDisplayDate(value);

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isSelected = (day) => {
    if (!value) return false;
    let selectedYear, selectedMonth, selectedDay;
    if (typeof value === 'string' && value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3) {
        selectedYear = parseInt(parts[0], 10);
        selectedMonth = parseInt(parts[1], 10) - 1;
        selectedDay = parseInt(parts[2], 10);
      }
    }
    if (!selectedYear) {
      const selectedDateObj = new Date(value);
      selectedYear = selectedDateObj.getFullYear();
      selectedMonth = selectedDateObj.getMonth();
      selectedDay = selectedDateObj.getDate();
    }
    return (
      selectedDay === day &&
      selectedMonth === currentMonth &&
      selectedYear === currentYear
    );
  };

  const handleSelectDay = (day) => {
    const dateStr = formatDateString(currentYear, currentMonth, day);
    if (checkIfCafeClosedOnDate(cafe, dateStr)) {
      toast.error('The cafe is closed on this date and does not accept bookings.', {
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <div className="w-full relative">
      <label className="block text-xs sm:text-sm font-black text-[#2C1810] mb-2 flex items-center">
        <Calendar size={15} className="mr-2 text-[#6F4E37]" /> {label}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-stone-50/90 hover:bg-white border border-stone-200/90 rounded-2xl px-3.5 sm:px-4 h-[46px] sm:h-[50px] transition-all shadow-2xs cursor-pointer group"
      >
        <span className="text-xs sm:text-sm font-black text-[#2C1810]">{formattedDisplay}</span>
        <span className="text-[10px] font-extrabold text-stone-400 group-hover:text-[#6F4E37] transition-colors">
          Pick Date
        </span>
      </button>

      {/* Calendar Modal Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-stone-200 shadow-2xl p-4 z-50 backdrop-blur-xl font-sans min-w-[280px]">
          
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
            <button 
              type="button" 
              onClick={handlePrevMonth}
              className="p-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-black px-2 transition-colors cursor-pointer"
            >
              &larr;
            </button>

            <span className="text-xs sm:text-sm font-black text-[#2C1810]">
              {monthNames[currentMonth]} {currentYear}
            </span>

            <button 
              type="button" 
              onClick={handleNextMonth}
              className="p-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-black px-2 transition-colors cursor-pointer"
            >
              &rarr;
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="text-[10px] font-black text-stone-400 uppercase">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-8" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const active = isSelected(day);
              const current = isToday(day);
              const dateStr = formatDateString(currentYear, currentMonth, day);
              const isClosed = checkIfCafeClosedOnDate(cafe, dateStr);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  disabled={isClosed}
                  title={isClosed ? 'Cafe Closed' : ''}
                  className={`h-8 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                    isClosed
                      ? 'bg-rose-50/80 text-rose-400 opacity-50 line-through cursor-not-allowed border border-rose-200/50'
                      : active
                      ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-xs cursor-pointer'
                      : current
                      ? 'bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60 font-black cursor-pointer'
                      : 'hover:bg-stone-100 text-stone-700 cursor-pointer'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Date Actions */}
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const tom = new Date(today.getTime() + 24 * 60 * 60 * 1000);
                const str = formatDateString(tom.getFullYear(), tom.getMonth(), tom.getDate());
                onChange(str);
                setIsOpen(false);
              }}
              className="text-[10px] font-black text-[#6F4E37] hover:underline cursor-pointer"
            >
              Tomorrow
            </button>
            
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-black text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

// Rolling Drum Wheel Column Component for Time Selector
const RollingColumn = ({ items, selectedValue, onSelect, label, formatDisplay }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const selectedIndex = items.findIndex(item => item === selectedValue);
      if (selectedIndex !== -1) {
        const itemHeight = 44;
        containerRef.current.scrollTop = selectedIndex * itemHeight;
      }
    }
  }, [selectedValue, items]);

  const handleScroll = (e) => {
    const itemHeight = 44;
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (items[index] && items[index] !== selectedValue) {
      onSelect(items[index]);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center min-w-0">
      <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider mb-1.5">{label}</span>
      <div className="relative h-[176px] w-full bg-white/90 rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden select-none">
        
        {/* Top & Bottom Gradient Overlay for 3D Drum Wheel Effect */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Center Highlight Selection Bar */}
        <div className="absolute inset-x-1.5 top-[66px] h-[44px] bg-[#6F4E37]/15 rounded-xl border border-[#6F4E37]/30 pointer-events-none z-0 shadow-2xs" />

        {/* Scrollable Wheel List with Snap Physics */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none py-[66px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => {
            const isSelected = item === selectedValue;
            return (
              <div
                key={item}
                onClick={() => onSelect(item)}
                className={`h-[44px] snap-center flex items-center justify-center font-black transition-all cursor-pointer ${
                  isSelected
                    ? 'text-[#2C1810] text-base sm:text-lg font-black scale-110'
                    : 'text-stone-400 opacity-40 text-xs sm:text-sm hover:opacity-80 scale-95'
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

// Custom Modern Interactive Rolling Drum Wheel Time Picker Component
const CustomTimePicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: '12', min: '00', ampm: 'PM' };
    let [h, m] = timeStr.split(':');
    h = parseInt(h, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return { 
      hour: h.toString().padStart(2, '0'), 
      min: m || '00', 
      ampm 
    };
  };

  const { hour, min, ampm } = parseTime(value);

  const updateTime = (newHour, newMin, newAmpm) => {
    let h = parseInt(newHour, 10);
    if (newAmpm === 'PM' && h !== 12) h += 12;
    if (newAmpm === 'AM' && h === 12) h = 0;
    const formattedHour = h.toString().padStart(2, '0');
    onChange({ target: { value: `${formattedHour}:${newMin}` } });
  };

  const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutesList = ['00', '15', '30', '45'];
  const ampmList = ['AM', 'PM'];

  const quickPresets = [
    { label: '10:00 AM', h: '10', m: '00', mode: 'AM' },
    { label: '12:00 PM', h: '12', m: '00', mode: 'PM' },
    { label: '02:00 PM', h: '02', m: '00', mode: 'PM' },
    { label: '04:00 PM', h: '04', m: '00', mode: 'PM' },
    { label: '06:00 PM', h: '06', m: '00', mode: 'PM' },
    { label: '08:00 PM', h: '08', m: '00', mode: 'PM' },
  ];

  return (
    <div className="flex-1 w-full min-w-0 relative">
      <span className="block text-xs font-black text-[#2C1810] mb-1.5 flex items-center gap-1.5">
        <Clock size={14} className="text-[#6F4E37]" />
        <span>{label}</span>
      </span>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-stone-50/90 hover:bg-white border border-stone-200/90 hover:border-[#DDB892] rounded-2xl px-4 h-[50px] transition-all shadow-2xs hover:shadow-md cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-[#FFF8F0] to-[#F5EBE0] text-[#6F4E37] px-3 py-1 rounded-xl border border-[#DDB892]/50 font-black text-sm shadow-2xs flex items-center gap-1">
            <span>{hour}:{min}</span>
            <span className="text-[11px] font-black uppercase text-[#4A2C11] ml-0.5">{ampm}</span>
          </div>
        </div>

        <span className="text-xs font-extrabold text-[#6F4E37] bg-[#FFF8F0] px-2.5 py-1 rounded-xl border border-[#DDB892]/40 group-hover:bg-[#6F4E37] group-hover:text-white transition-all">
          Change
        </span>
      </button>

      {/* Rolling Drum Wheel Time Picker Panel */}
      {isOpen && (
        <div className="relative mt-2.5 bg-[#FFF8F0]/95 backdrop-blur-xl rounded-3xl border border-[#DDB892]/60 shadow-[0_12px_40px_rgba(74,44,17,0.12)] p-4 sm:p-5 font-sans w-full z-10 transition-all space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#DDB892]/30">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#6F4E37]" />
              <span className="text-xs font-black text-[#2C1810]">Select {label}</span>
            </div>

            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-black text-[#6F4E37] hover:text-stone-900 bg-white hover:bg-stone-100 border border-[#DDB892]/40 px-3 py-1 rounded-full transition-colors cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>

          {/* Quick Slots */}
          <div>
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-1.5">Quick Slots</span>
            <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
              {quickPresets.map((preset) => {
                const isSelected = hour === preset.h && min === preset.m && ampm === preset.mode;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateTime(preset.h, preset.m, preset.mode)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#6F4E37] text-white shadow-2xs'
                        : 'bg-white text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] border border-[#DDB892]/40'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Column Interactive Rolling Drum Wheels */}
          <div className="flex items-center gap-2 sm:gap-3 bg-stone-100/70 p-3 rounded-2xl border border-stone-200/60">
            <RollingColumn 
              items={hoursList} 
              selectedValue={hour} 
              onSelect={(newH) => updateTime(newH, min, ampm)} 
              label="Hours"
            />
            
            <div className="text-xl font-black text-[#6F4E37] self-center pb-2">:</div>

            <RollingColumn 
              items={minutesList} 
              selectedValue={min} 
              onSelect={(newM) => updateTime(hour, newM, ampm)} 
              label="Minutes"
              formatDisplay={(m) => `:${m}`}
            />

            <RollingColumn 
              items={ampmList} 
              selectedValue={ampm} 
              onSelect={(newMode) => updateTime(hour, min, newMode)} 
              label="Period"
            />
          </div>

          {/* Footer Action */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] hover:from-[#3A220D] hover:to-[#5D3F2B] text-white text-xs font-black rounded-2xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <CheckCircle2 size={15} /> Confirm {label} ({hour}:{min} {ampm})
          </button>

        </div>
      )}
    </div>
  );
};

export default function BookingInformationForm() {
  const { 
    selectedDate, setDate, 
    selectedTimeSlot, setTimeSlot, 
    guestCount, setGuestCount,
    specialRequests, setSpecialRequests,
    eventSpecialRequests, setEventSpecialRequests,
    selectedEventCompany,
    couponCode, applyCoupon, removeCoupon, discountAmount
  } = useBookingStore();

  const [localCoupon, setLocalCoupon] = useState(couponCode || '');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (localCoupon.toLowerCase() === 'fahara10') {
      applyCoupon(localCoupon, 500); // flat 500 off
      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Invalid Coupon Code. Try FAHARA10', {
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('13:00');

  // Trigger time slot calculation on mount to initialize the time slot
  useEffect(() => {
    calculateAndSetTimeSlot('12:00', '13:00');
  }, []);

  const calculateAndSetTimeSlot = (startStr, endStr) => {
    if (!startStr || !endStr) {
      setTimeSlot(null);
      return;
    }
    
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    
    let hoursDiff = endH - startH + (endM - startM) / 60;

    const formatAMPM = (h, m) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      let formattedH = h % 12;
      if (formattedH === 0) formattedH = 12;
      return `${formattedH}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    if (hoursDiff > 0) {
      setTimeSlot({
        start: formatAMPM(startH, startM),
        end: formatAMPM(endH, endM),
        hours: hoursDiff
      });
    } else {
      setTimeSlot(null);
    }
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    calculateAndSetTimeSlot(e.target.value, endTime);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
    calculateAndSetTimeSlot(startTime, e.target.value);
  };

  const { id: cafeId } = useParams();
  const { data: cafeResponse } = useCafeDetails(cafeId);
  const cafe = cafeResponse?.data;

  const isSelectedDateClosed = selectedDate ? checkIfCafeClosedOnDate(cafe, selectedDate) : false;
  const timeValidation = selectedDate ? checkIfTimeWithinBusinessHours(cafe, selectedDate, startTime, endTime, selectedEventCompany) : { isValid: true };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-5 sm:p-8 mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans"
    >
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] mb-1.5 tracking-tight">Booking Details</h2>
        <p className="text-stone-500 font-medium text-xs sm:text-sm">Select when you want to visit and how many guests are coming.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Custom Modern Date Selector */}
        <div>
          <CustomDatePicker 
            label="Date"
            value={selectedDate || ''}
            onChange={(dateStr) => setDate(dateStr)}
            cafe={cafe}
          />
          {isSelectedDateClosed && (
            <div className="mt-2.5 p-3 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-extrabold shadow-2xs">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>This cafe is closed on the selected date and does not accept bookings. Please pick an open date.</span>
            </div>
          )}
        </div>

        {/* Guest Count */}
        <div>
          <label className="block text-xs sm:text-sm font-black text-[#2C1810] mb-2 flex items-center">
            <Users size={15} className="mr-2 text-[#6F4E37]" /> Guests
          </label>
          <div className="flex items-center border border-stone-200/90 rounded-2xl bg-stone-50/90 p-1 h-[46px] sm:h-[50px]">
            <button 
              type="button"
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              className="w-10 sm:w-12 h-full flex items-center justify-center bg-white rounded-xl border border-stone-200/80 text-[#2C1810] font-black hover:bg-stone-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
            >
              -
            </button>
            <div className="flex-1 text-center font-black text-sm sm:text-base text-[#2C1810]">{guestCount}</div>
            <button 
              type="button"
              onClick={() => setGuestCount(guestCount + 1)}
              className="w-10 sm:w-12 h-full flex items-center justify-center bg-white rounded-xl border border-stone-200/80 text-[#2C1810] font-black hover:bg-stone-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Custom Modern Time Selection */}
      <div className="mb-6">
        <label className="block text-xs sm:text-sm font-black text-[#2C1810] mb-2.5 flex items-center justify-between">
          <span className="flex items-center">
            <Clock size={15} className="mr-2 text-[#6F4E37]" /> Select Time
          </span>
          {timeValidation.openTimeFormatted && timeValidation.closeTimeFormatted && (
            <span className="text-[10px] font-black text-[#6F4E37] bg-[#FFF8F0] px-2.5 py-1 rounded-full border border-[#DDB892]/40">
              Operating Hours: {timeValidation.openTimeFormatted} - {timeValidation.closeTimeFormatted}
            </span>
          )}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <StartTimePicker 
            label="Start Time" 
            value={startTime} 
            onChange={handleStartTimeChange} 
            cafe={cafe}
            selectedDate={selectedDate}
          />
          <StartTimePicker 
            label="End Time" 
            value={endTime} 
            onChange={handleEndTimeChange} 
            cafe={cafe}
            selectedDate={selectedDate}
          />
        </div>
        {selectedTimeSlot && selectedTimeSlot.hours > 0 ? (
          <p className="text-xs font-black text-emerald-600 mt-2.5 text-right">
            Total Duration: {selectedTimeSlot.hours} Hours
          </p>
        ) : selectedTimeSlot && selectedTimeSlot.hours <= 0 ? (
          <p className="text-xs font-black text-rose-600 mt-2.5 text-right">
            End time must be after start time
          </p>
        ) : null}

        {/* Business Hours Validation Alert */}
        {!timeValidation.isValid && (
          <div className="mt-3.5 p-4 bg-gradient-to-r from-amber-500/10 via-amber-50/90 to-amber-500/5 border border-amber-300/80 rounded-2xl flex items-start gap-3 text-amber-950 text-xs font-semibold shadow-2xs">
            <div className="p-1.5 bg-amber-500/15 text-amber-800 rounded-xl shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div className="space-y-0.5">
              <p className="font-black uppercase tracking-wider text-[10px] text-amber-900">Outside Operating Hours</p>
              <p className="leading-relaxed text-amber-900/90">{timeValidation.message}</p>
            </div>
          </div>
        )}
      </div>

      <hr className="border-stone-100 my-5" />

      {/* Special Requests for Cafe / Venue */}
      <div className="mb-5">
        <label className="block text-xs sm:text-sm font-black text-[#2C1810] mb-2 flex items-center">
          <MessageSquare size={15} className="mr-2 text-[#6F4E37]" /> Venue & Cafe Special Requests <span className="text-stone-400 font-bold ml-1">(Optional)</span>
        </label>
        <textarea 
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="E.g., Any dietary restrictions, specific seating location, table preferences..."
          rows={2}
          className="w-full p-3 sm:p-3.5 bg-stone-50/90 border border-stone-200/90 rounded-2xl focus:ring-2 focus:ring-[#6F4E37]/40 focus:border-[#6F4E37] outline-none text-[#2C1810] text-xs sm:text-sm font-semibold leading-relaxed resize-none transition-all placeholder:text-stone-400"
        ></textarea>
      </div>

      {/* Special Requests for Event Manager / Setup (Only shown if 3rd party Event Manager is chosen) */}
      {selectedEventCompany && (
        <div className="mb-6">
          <label className="block text-xs sm:text-sm font-black text-[#6F4E37] mb-2 flex items-center">
            <Sparkles size={15} className="mr-2 text-[#6F4E37]" /> Special Requests for Event Manager <span className="text-stone-400 font-bold ml-1">(Optional)</span>
          </label>
          <textarea 
            value={eventSpecialRequests}
            onChange={(e) => setEventSpecialRequests(e.target.value)}
            placeholder="E.g., Cake customization details (e.g. two unique cakes), theme colors, entrance song..."
            rows={3}
            className="w-full p-3 sm:p-3.5 bg-[#FFF8F0]/90 border border-[#DDB892]/80 rounded-2xl focus:ring-2 focus:ring-[#6F4E37]/40 focus:border-[#6F4E37] outline-none text-[#2C1810] text-xs sm:text-sm font-semibold leading-relaxed resize-none transition-all placeholder:text-stone-400"
          ></textarea>
        </div>
      )}

    </motion.section>
  );
}
