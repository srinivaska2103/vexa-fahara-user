import { useBookingStore } from '@/stores/booking.store';
import { CalendarDays, Clock, Users, Coffee } from 'lucide-react';
import { format } from 'date-fns';
import EventCard from '@/app/components/cafe-details/EventCard';

export default function BookingSummary({ cafe }) {
  const { selectedPackage, selectedDate, selectedTimeSlot, guestCount, pricing } = useBookingStore();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--color-border)] shadow-sm">
      <h3 className="text-xl font-black text-[var(--color-text-primary)] mb-6 pb-6 border-b border-gray-100">
        Booking Summary
      </h3>
      
      {!selectedPackage ? (
        <div className="text-center py-8">
          <Coffee className="mx-auto text-gray-300 mb-3" size={32} />
          <p className="text-gray-500 text-sm">Select a package to see your summary.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <EventCard event={selectedPackage} cafeId={cafe?.id} />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Date</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  {selectedDate ? format(new Date(selectedDate), 'EEEE, MMM do, yyyy') : 'Not selected'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Time</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  {selectedTimeSlot ? selectedTimeSlot.display : 'Not selected'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Guests</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  {guestCount} People
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 font-medium">Base Price</span>
              <span className="font-bold text-gray-800">${pricing.basePrice}</span>
            </div>
            
            {pricing.total > 0 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-lg font-black text-[var(--color-text-primary)]">Total</span>
                <span className="text-2xl font-black text-[var(--color-text-primary)]">${pricing.total.toFixed(2)}</span>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
