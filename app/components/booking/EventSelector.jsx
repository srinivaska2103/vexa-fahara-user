import { useBookingStore } from '@/stores/booking.store';
import EventCard from '@/app/components/cafe-details/EventCard';

export default function EventSelector({ cafe }) {
  const { selectedPackage, setPackage } = useBookingStore();
  const events = cafe?.cafe_packages || [];

  if (events.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Packages Available</h3>
        <p className="text-gray-500">This cafe hasn't added any event packages yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Select an Event Package</h2>
        <p className="text-gray-500 font-medium">Choose the perfect package for your upcoming event.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {events.map(pkg => (
          <div 
            key={pkg.id} 
            className={`relative rounded-2xl cursor-pointer transition-all border-2 ${
              selectedPackage?.id === pkg.id 
                ? 'border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/10 shadow-lg scale-[1.01]' 
                : 'border-transparent hover:border-gray-200 opacity-70 hover:opacity-100'
            }`}
            onClick={() => setPackage(pkg)}
          >
            <EventCard event={pkg} cafeId={cafe.id} />
            
            {selectedPackage?.id === pkg.id && (
              <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md z-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
