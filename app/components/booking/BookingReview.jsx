import { useBookingStore } from '@/stores/booking.store';
import { Coffee, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function BookingReview({ cafe }) {
  const { selectedPackage, selectedDate, selectedTimeSlot, guestCount, specialRequests } = useBookingStore();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--color-border)] shadow-sm">
      <div className="flex gap-6 mb-6 pb-6 border-b border-gray-100">
        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
          <img 
            src={cafe?.media?.[0]?.file_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop'} 
            alt={cafe?.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[var(--color-text-primary)] mb-1">{cafe?.name}</h2>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin size={16} className="mr-1" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{cafe?.address || 'Cafe location'}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded font-semibold text-xs uppercase tracking-wider">
            <Coffee size={14} />
            {selectedPackage?.package_name}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date & Time</h4>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-[var(--color-primary)]" size={18} />
            <span className="font-semibold text-gray-800">
              {selectedDate ? format(new Date(selectedDate), 'MMMM do, yyyy') : ''}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-[var(--color-primary)]" size={18} />
            <span className="font-semibold text-gray-800">
              {selectedTimeSlot?.display}
            </span>
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Details</h4>
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-[var(--color-primary)]" size={18} />
            <span className="font-semibold text-gray-800">
              {guestCount} Guests
            </span>
          </div>
          {specialRequests && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 italic border border-gray-100">
              "{specialRequests}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
