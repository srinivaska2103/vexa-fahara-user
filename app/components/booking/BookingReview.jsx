import { useBookingStore } from '@/stores/booking.store';
import { Coffee, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function BookingReview({ cafe }) {
  const { selectedPackage, selectedEventCompany, selectedDate, selectedTimeSlot, guestCount, specialRequests, eventSpecialRequests } = useBookingStore();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm text-[#2C1810]">
      <div className="flex gap-6 mb-6 pb-6 border-b border-stone-100">
        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-stone-100">
          <img 
            src={cafe?.media?.[0]?.file_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop'} 
            alt={cafe?.name || 'Cafe'} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#2C1810] mb-1">{cafe?.name}</h2>
          <div className="flex items-center text-stone-500 text-sm mb-2">
            <MapPin size={16} className="mr-1 text-[#6F4E37]" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{cafe?.address || 'Cafe location'}</span>
          </div>
          {selectedPackage && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60 rounded-lg font-bold text-xs">
              <Coffee size={14} />
              <span>{selectedPackage.package_name || selectedPackage.title || 'Package'}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider mb-2">Date & Time</h4>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-[#6F4E37]" size={18} />
            <span className="font-bold text-[#2C1810]">
              {selectedDate ? format(new Date(selectedDate), 'MMMM do, yyyy') : 'Date not selected'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-[#6F4E37]" size={18} />
            <span className="font-bold text-[#2C1810]">
              {selectedTimeSlot ? `${selectedTimeSlot.start || ''} - ${selectedTimeSlot.end || ''}` : 'Time not selected'}
            </span>
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider mb-2">Event Details</h4>
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-[#6F4E37]" size={18} />
            <span className="font-bold text-[#2C1810]">
              {guestCount} Guests
            </span>
          </div>

          {specialRequests && (
            <div className="mt-4 p-4 bg-stone-50 rounded-2xl text-xs text-stone-700 italic border border-stone-200">
              <span className="font-black text-[#2C1810] block not-italic mb-1">💬 Venue & Cafe Special Requests:</span>
              "{specialRequests}"
            </div>
          )}

          {eventSpecialRequests && selectedEventCompany && (
            <div className="mt-3 p-4 bg-[#FFF8F0] rounded-2xl text-xs text-[#2C1810] italic border border-[#DDB892]/60">
              <span className="font-black text-[#6F4E37] block not-italic mb-1">✨ Special Requests for Event Manager:</span>
              "{eventSpecialRequests}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
