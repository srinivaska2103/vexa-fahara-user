import { useState } from 'react';
import { useBookingStore } from '@/stores/booking.store';
import { useCouponValidation } from '@/hooks/useBooking';
import { Tag, Loader2, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CouponBox() {
  const [inputCode, setInputCode] = useState('');
  const { couponCode, discountAmount, applyCoupon, removeCoupon } = useBookingStore();
  const couponMutation = useCouponValidation();

  const handleApply = async () => {
    if (!inputCode.trim()) return;
    try {
      const result = await couponMutation.mutateAsync(inputCode);
      applyCoupon(inputCode.toUpperCase(), result.discountAmount);
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setInputCode('');
    toast.success("Coupon removed.");
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[var(--color-border)] shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Tag className="text-[var(--color-primary)]" size={20} />
        <h3 className="text-lg font-black text-[var(--color-text-primary)]">Apply Coupon</h3>
      </div>
      
      {couponCode ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
              <CheckCircle size={16} />
              {couponCode} Applied
            </div>
            <p className="text-sm text-green-600">You saved ${discountAmount} on this booking!</p>
          </div>
          <button 
            onClick={handleRemove}
            className="p-2 text-green-700 hover:bg-green-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. FAHARA10"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-mono uppercase"
            />
            <button 
              onClick={handleApply}
              disabled={!inputCode.trim() || couponMutation.isPending}
              className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {couponMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : 'Apply'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">Hint: Use FAHARA10 for 10% discount</p>
        </div>
      )}
    </div>
  );
}
