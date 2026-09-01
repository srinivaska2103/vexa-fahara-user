import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Info, Loader2, AlertCircle } from 'lucide-react';
import { useBookingStore } from '@/stores/booking.store';
import { useRouter, useParams } from 'next/navigation';
import { useCafeDetails } from '@/hooks/useCafeDetails';
import { checkIfCafeClosedOnDate, checkIfTimeWithinBusinessHours } from '@/lib/utils';
import { bookingService } from '@/services/booking.service';
import toast from 'react-hot-toast';

export default function StickyBookingSummary({ cafeName }) {
  const router = useRouter();
  const { id: cafeId } = useParams();
  const { data: cafeResponse } = useCafeDetails(cafeId);
  const cafe = cafeResponse?.data;

  const { 
    selectedDate, 
    selectedTimeSlot, 
    guestCount,
    selectedPackage,
    selectedEventCompany,
    pricing,
    discountAmount
  } = useBookingStore();

  const [isProcessing, setIsProcessing] = useState(false);

  const timeCheck = (selectedDate && selectedTimeSlot)
    ? checkIfTimeWithinBusinessHours(cafe, selectedDate, selectedTimeSlot.start, selectedTimeSlot.end, selectedEventCompany)
    : { isValid: true };

  const handlePayment = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select a date and time slot first.', {
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    if (checkIfCafeClosedOnDate(cafe, selectedDate)) {
      toast.error('The cafe is closed on the selected booking date. Please choose an open day to book.', {
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    if (!timeCheck.isValid) {
      toast.error(timeCheck.message || 'Selected time slot is outside business operating hours.', {
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    setIsProcessing(true);
    try {
      const convertToHHMMSS = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
      };

      const payload = {
        cafe_id: useBookingStore.getState().cafeId,
        package_id: selectedPackage ? selectedPackage.id : null,
        event_service_id: selectedEventCompany ? selectedEventCompany.id : null,
        booking_date: selectedDate,
        start_time: convertToHHMMSS(selectedTimeSlot.start),
        end_time: convertToHHMMSS(selectedTimeSlot.end),
        hours: selectedTimeSlot.hours,
        total_persons: guestCount,
        discount: discountAmount,
        special_request: useBookingStore.getState().specialRequests || '',
        event_special_request: selectedEventCompany ? (useBookingStore.getState().eventSpecialRequests || '') : null
      };

      const response = await bookingService.createBooking(payload);
      router.push(`/customer/payment?bookingId=${response.data.id}`);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in to complete your booking.');
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      } else {
        toast.error(error.response?.data?.message || 'Failed to create booking. This time slot might be taken.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.08)] p-5 sm:p-6 sticky top-[7.5rem] z-20 font-sans w-full"
    >
      <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] mb-4 tracking-tight">Booking Summary</h2>
      
      {/* Selected Items / Meta Summary */}
      <div className="mb-5 space-y-2">
        <h3 className="font-black text-sm text-[#2C1810]">{cafeName}</h3>
        <p className="text-xs font-bold text-stone-500">
          {selectedDate ? selectedDate : 'Select Date'} • {selectedTimeSlot ? `${selectedTimeSlot.start}` : '12:00 PM'}
        </p>
        <p className="text-xs font-bold text-stone-500">{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</p>
        
        {(selectedEventCompany || selectedPackage) && (
          <div className="mt-3 p-3 bg-[#FFF8F0] border border-[#DDB892]/40 rounded-2xl space-y-1">
            {selectedEventCompany && (
              <div className="flex items-center text-xs">
                <span className="font-bold text-[#6F4E37] mr-1.5">Arrangement:</span>
                <span className="font-black text-[#2C1810] truncate">{selectedEventCompany.name}</span>
              </div>
            )}
            {selectedPackage && (
              <div className="flex items-center text-xs">
                <span className="font-bold text-[#6F4E37] mr-1.5">Package:</span>
                <span className="font-black text-[#2C1810] truncate">{selectedPackage.name}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <hr className="border-stone-100 mb-5" />

      {/* Pricing Breakdown */}
      <div className="space-y-3 mb-5 text-xs sm:text-sm text-stone-600 font-medium">
        <div className="flex justify-between">
          <span>Cafe Charges</span>
          <span className="font-black text-[#2C1810]">₹{(pricing?.cafeCharge || 0).toLocaleString()}</span>
        </div>
        
        {selectedPackage && (
          <div className="flex justify-between">
            <span className="truncate mr-2">Cafe Package ({selectedPackage.name})</span>
            <span className="font-black text-[#2C1810] shrink-0">₹{(pricing?.cafePackageCharge || 0).toLocaleString()}</span>
          </div>
        )}
        
        {selectedEventCompany && (
          <div className="flex justify-between">
            <span className="truncate mr-2">Event Arrangement ({selectedEventCompany.name})</span>
            <span className="font-black text-[#2C1810] shrink-0">₹{(pricing?.eventCompanyCharge || 0).toLocaleString()}</span>
          </div>
        )}

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-extrabold">
            <span>Discount Applied</span>
            <span className="font-black">-₹{discountAmount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between pt-2 border-t border-stone-100 font-black">
          <span className="text-[#2C1810]">Subtotal</span>
          <span className="text-[#2C1810]">₹{(pricing?.subtotal || 0).toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-stone-500 text-xs">
          <span className="flex items-center">
            Platform Fee (3%) 
            <Info size={12} className="ml-1 text-stone-400 cursor-help" title="Helps us maintain the platform" />
          </span>
          <span className="font-black text-[#2C1810]">₹{Number((pricing?.faharaServiceFee || 0).toFixed(2)).toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-stone-500 text-xs">
          <span className="flex items-center">
            Transaction Fee (3%)
            <Info size={12} className="ml-1 text-stone-400 cursor-help" title="Payment processing fee" />
          </span>
          <span className="font-black text-[#2C1810]">₹{Number((pricing?.transactionFee || 0).toFixed(2)).toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-stone-500 text-xs">
          <span className="flex items-center">
            GST (18% on Txn Fee)
            <Info size={12} className="ml-1 text-stone-400 cursor-help" title="Government tax on transaction fee" />
          </span>
          <span className="font-black text-[#2C1810]">₹{Number((pricing?.gst || 0).toFixed(2)).toLocaleString()}</span>
        </div>
      </div>

      <hr className="border-stone-100 mb-5" />

      {/* Grand Total */}
      <div className="flex justify-between items-end mb-5">
        <div>
          <span className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Grand Total</span>
          <div className="text-[10px] text-stone-400 font-bold leading-none">Includes taxes & fees</div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">
          ₹{Number((pricing?.total || 0).toFixed(2)).toLocaleString()}
        </div>
      </div>

      {/* Business Hours Warning Notice if not available */}
      {!timeCheck.isValid && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-900 text-xs font-semibold shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-black uppercase tracking-wider text-[10px] text-rose-800">Not Available at Selected Time</p>
            <p className="leading-relaxed text-rose-800/90">{timeCheck.message}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <motion.button 
        whileHover={{ scale: timeCheck.isValid && !isProcessing ? 1.02 : 1 }}
        whileTap={{ scale: timeCheck.isValid && !isProcessing ? 0.96 : 1 }}
        onClick={handlePayment}
        disabled={isProcessing || !timeCheck.isValid}
        className={`w-full py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
          !timeCheck.isValid 
            ? 'bg-stone-200 text-stone-500 border border-stone-300 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-lg shadow-[#4A2C11]/20 hover:shadow-xl cursor-pointer disabled:opacity-60'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : !timeCheck.isValid ? (
          <span>Venue / Service Not Available</span>
        ) : (
          <span>Proceed To Payment</span>
        )}
      </motion.button>

      <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-stone-400">
        <CheckCircle size={13} className="text-emerald-600" />
        <span>Instant Booking Confirmation</span>
      </div>

    </motion.div>
  );
}
