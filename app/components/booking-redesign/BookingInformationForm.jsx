import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MessageSquare, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBookingStore } from '@/stores/booking.store';
import { useParams } from 'next/navigation';
import { useCafeDetails } from '@/hooks/useCafeDetails';
import { checkIfCafeClosedOnDate } from '@/lib/utils';
import toast from 'react-hot-toast';

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

// Custom Modern Interactive Time Picker Component
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

      {/* Modern Glassmorphic Time Picker Panel */}
      {isOpen && (
        <div className="relative mt-2.5 bg-[#FFF8F0]/90 backdrop-blur-xl rounded-3xl border border-[#DDB892]/60 shadow-[0_8px_30px_rgba(74,44,17,0.08)] p-4 sm:p-5 font-sans w-full z-10 transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#DDB892]/30">
            <div className="flex items-center gap-1.5">
              <Clock size={15} className="text-[#6F4E37]" />
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

          {/* Quick Presets Bar */}
          <div className="mb-3">
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-1.5">Quick Slots</span>
            <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
              {quickPresets.map((preset) => {
                const isSelected = hour === preset.h && min === preset.m && ampm === preset.mode;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      updateTime(preset.h, preset.m, preset.mode);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black whitespace-nowrap transition-all cursor-pointer shrink-0 ${
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

          {/* AM / PM Segmented Toggle */}
          <div className="grid grid-cols-2 rounded-2xl bg-stone-100/90 p-1 mb-3.5 border border-stone-200/60">
            {['AM', 'PM'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateTime(hour, min, mode)}
                className={`py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  ampm === mode 
                    ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-sm' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Hours Grid */}
          <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Hours</div>
          <div className="grid grid-cols-4 gap-1.5 mb-3.5">
            {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
              <button
                key={h}
                type="button"
                onClick={() => updateTime(h, min, ampm)}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  hour === h 
                    ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-md shadow-[#4A2C11]/20 scale-105' 
                    : 'bg-stone-50 hover:bg-[#FFF8F0] hover:text-[#6F4E37] text-stone-700 border border-stone-200/60'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Minutes Grid */}
          <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Minutes</div>
          <div className="grid grid-cols-4 gap-1.5">
            {['00', '15', '30', '45'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  updateTime(hour, m, ampm);
                  setIsOpen(false);
                }}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  min === m 
                    ? 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-md shadow-[#4A2C11]/20 scale-105' 
                    : 'bg-stone-50 hover:bg-[#FFF8F0] hover:text-[#6F4E37] text-stone-700 border border-stone-200/60'
                }`}
              >
                :{m}
              </button>
            ))}
          </div>

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
        <label className="block text-xs sm:text-sm font-black text-[#2C1810] mb-2.5 flex items-center">
          <Clock size={15} className="mr-2 text-[#6F4E37]" /> Select Time
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <CustomTimePicker 
            label="Start Time" 
            value={startTime} 
            onChange={handleStartTimeChange} 
          />
          <CustomTimePicker 
            label="End Time" 
            value={endTime} 
            onChange={handleEndTimeChange} 
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
      </div>

      <hr className="border-stone-100 my-5" />

      {/* Special Requests */}
      <div className="mb-6">
        <label className="block text-xs sm:text-sm font-black text-[#2C1810] mb-2 flex items-center">
          <MessageSquare size={15} className="mr-2 text-[#6F4E37]" /> Special Requests <span className="text-stone-400 font-bold ml-1">(Optional)</span>
        </label>
        <textarea 
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="E.g., Any dietary restrictions, specific table location..."
          rows={3}
          className="w-full p-3 sm:p-3.5 bg-stone-50/90 border border-stone-200/90 rounded-2xl focus:ring-2 focus:ring-[#6F4E37]/40 focus:border-[#6F4E37] outline-none text-[#2C1810] text-xs sm:text-sm font-semibold leading-relaxed resize-none transition-all placeholder:text-stone-400"
        ></textarea>
      </div>

    </motion.section>
  );
}
