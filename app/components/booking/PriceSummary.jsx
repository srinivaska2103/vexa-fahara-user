import { useBookingStore } from '@/stores/booking.store';
import { IndianRupee } from 'lucide-react';

export default function PriceSummary() {
  const { pricing } = useBookingStore();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--color-border)] shadow-sm">
      <h3 className="text-xl font-black text-[var(--color-text-primary)] mb-6 pb-6 border-b border-gray-100">
        Price Breakdown
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center text-gray-600">
          <span>Base Package Price</span>
          <span className="font-semibold">${pricing.basePrice}</span>
        </div>
        
        {pricing.discountAmount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span>Coupon Discount</span>
            <span className="font-semibold">-${pricing.discountAmount}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-gray-600 pt-4 border-t border-gray-100">
          <span>Subtotal</span>
          <span className="font-semibold">${pricing.subtotal}</span>
        </div>
        
        <div className="flex justify-between items-center text-gray-600">
          <span>Taxes (GST 18%)</span>
          <span className="font-semibold">${pricing.gst.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center text-gray-600">
          <span>Fahara Service Fee</span>
          <span className="font-semibold">${pricing.faharaServiceFee}</span>
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-100">
          <span className="text-xl font-black text-[var(--color-text-primary)]">Total Amount</span>
          <span className="text-3xl font-black text-[var(--color-primary)]">${pricing.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
