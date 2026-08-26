import { useBookingStore } from '@/stores/booking.store';
import { useAvailableSlots } from '@/hooks/useBooking';
import { Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function TimeSlotPicker({ cafeId }) {
  const { selectedDate, selectedTimeSlot, setTimeSlot } = useBookingStore();
  
  const { data: slots, isLoading, error } = useAvailableSlots(cafeId, selectedDate);

  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={32} />
        <p className="text-gray-500 font-medium">Finding available time slots...</p>
      </div>
    );
  }

  if (error || !slots || slots.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
        <Clock className="text-gray-300 mb-4" size={48} />
        <h3 className="text-lg font-bold text-gray-700 mb-1">No Slots Available</h3>
        <p className="text-gray-500 text-sm">The cafe is closed on this date or fully booked.</p>
      </div>
    );
  }

  // Group slots by label (Morning, Afternoon, Evening, Night)
  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.label]) acc[slot.label] = [];
    acc[slot.label].push(slot);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Select a Time</h2>
        <p className="text-gray-500 font-medium">
          Available slots for {selectedDate ? format(new Date(selectedDate), 'EEEE, MMMM do') : ''}
        </p>
      </div>
      
      <div className="space-y-8">
        {Object.entries(groupedSlots).map(([label, timeSlots]) => (
          <div key={label}>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              {label}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots.map(slot => {
                const isSelected = selectedTimeSlot?.id === slot.id;
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => setTimeSlot(slot)}
                    className={`
                      py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 border-2
                      ${isSelected 
                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md scale-105' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-[var(--color-primary)]/50 hover:bg-orange-50'
                      }
                    `}
                  >
                    {slot.display}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
