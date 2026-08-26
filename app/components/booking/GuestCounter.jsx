import { useBookingStore } from '@/stores/booking.store';
import { Minus, Plus, Users } from 'lucide-react';

export default function GuestCounter() {
  const { selectedPackage, guestCount, setGuestCount } = useBookingStore();
  
  const minGuests = selectedPackage?.minimum_persons || 1;
  const maxGuests = selectedPackage?.maximum_persons || 50;

  const handleDecrease = () => {
    if (guestCount > minGuests) {
      setGuestCount(guestCount - 1);
    }
  };

  const handleIncrease = () => {
    if (guestCount < maxGuests) {
      setGuestCount(guestCount + 1);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Who's coming?</h2>
        <p className="text-gray-500 font-medium">Select the number of guests for your event.</p>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
            <Users className="text-[var(--color-primary)]" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[var(--color-text-primary)]">Guests</h3>
            <p className="text-sm text-gray-500">
              Capacity: {minGuests} - {maxGuests} people
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleDecrease}
            disabled={guestCount <= minGuests}
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-200 text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-30 disabled:hover:border-gray-200 disabled:cursor-not-allowed"
          >
            <Minus size={18} strokeWidth={3} />
          </button>
          
          <span className="w-8 text-center text-2xl font-black text-[var(--color-text-primary)]">
            {guestCount}
          </span>
          
          <button 
            onClick={handleIncrease}
            disabled={guestCount >= maxGuests}
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-200 text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-30 disabled:hover:border-gray-200 disabled:cursor-not-allowed"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
        
      </div>
    </div>
  );
}
