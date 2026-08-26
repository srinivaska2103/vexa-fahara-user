import { useState } from 'react';
import { useBookingStore } from '@/stores/booking.store';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfDay 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BookingCalendar({ cafeId }) {
  const { selectedDate, setDate } = useBookingStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = startOfDay(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 border border-gray-200 rounded-full hover:bg-gray-50">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 border border-gray-200 rounded-full hover:bg-gray-50">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-semibold text-sm text-gray-400 uppercase py-2" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const isPast = isBefore(day, today);
        const isSelected = selectedDate && isSameDay(day, new Date(selectedDate));
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        days.push(
          <div
            key={day}
            onClick={() => !isPast && setDate(format(cloneDay, 'yyyy-MM-dd'))}
            className={`
              relative p-2 flex items-center justify-center h-14 
              ${!isCurrentMonth ? 'opacity-20' : ''}
              ${isPast ? 'opacity-30 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:bg-orange-50'}
              ${isSelected ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)]' : ''}
              rounded-xl transition-all duration-200 border border-transparent
            `}
          >
            <span className={`
              text-lg font-bold
              ${isSelected ? 'text-white' : isPast ? 'text-gray-400' : 'text-gray-700'}
            `}>
              {formattedDate}
            </span>
            {isSameDay(day, today) && !isSelected && (
              <div className="absolute bottom-1 w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[var(--color-text-primary)]">When will your event be?</h2>
        <p className="text-gray-500 font-medium">Select an available date for your booking.</p>
      </div>
      
      <div className="bg-white p-2">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}
