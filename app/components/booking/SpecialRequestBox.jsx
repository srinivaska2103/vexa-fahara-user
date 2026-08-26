import { useBookingStore } from '@/stores/booking.store';
import { MessageSquare } from 'lucide-react';

export default function SpecialRequestBox() {
  const { specialRequests, setSpecialRequests } = useBookingStore();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Special Requests</h2>
        <p className="text-gray-500 font-medium">Any special requirements for your event? Let us know.</p>
      </div>
      
      <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-sm focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/10 transition-all">
        <div className="flex gap-3 px-3 pt-3">
          <MessageSquare className="text-gray-400 shrink-0 mt-1" size={20} />
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="E.g., We need a baby chair, please play happy birthday song at 8 PM..."
            className="w-full h-40 resize-none outline-none text-gray-700 bg-transparent"
          />
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mt-4">
        * Requests are subject to the cafe's availability and policies. Additional charges may apply.
      </p>
    </div>
  );
}
