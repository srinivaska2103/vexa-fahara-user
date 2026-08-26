'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/stores/booking.store';
import { useCafeDetails } from '@/hooks/useCafeDetails';
import { useCreateBooking } from '@/hooks/useBooking';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Booking Components
import BookingSummary from '@/app/components/booking/BookingSummary';
import PriceSummary from '@/app/components/booking/PriceSummary';
import CouponBox from '@/app/components/booking/CouponBox';
import CancellationPolicy from '@/app/components/booking/CancellationPolicy';
import BookingReview from '@/app/components/booking/BookingReview';

export default function ReviewBookingPage() {
  const { id: cafeId } = useParams();
  const router = useRouter();
  
  const state = useBookingStore();
  const { data: cafeResponse, isLoading: cafeLoading } = useCafeDetails(cafeId);
  const cafe = cafeResponse?.data;
  
  const createBookingMutation = useCreateBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if incomplete booking data
  useEffect(() => {
    if (!state.selectedPackage || !state.selectedDate || !state.selectedTimeSlot) {
      toast.error("Please complete all booking steps first.");
      router.push(`/booking/${cafeId}`);
    }
  }, [state.selectedPackage, state.selectedDate, state.selectedTimeSlot, cafeId, router]);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      
      const [startHour] = state.selectedTimeSlot.start_time.split(':');
      const [endHour] = state.selectedTimeSlot.end_time.split(':');
      
      const payload = {
        cafe_id: cafeId,
        package_id: state.selectedPackage?.id,
        event_service_id: state.selectedEventCompany?.id,
        booking_date: state.selectedDate,
        start_time: `${String(startHour).padStart(2, '0')}:00:00`,
        end_time: `${String(endHour).padStart(2, '0')}:00:00`,
        hours: state.selectedTimeSlot.hours,
        total_persons: state.guestCount,
        special_request: state.specialRequests || '',
        discount: state.pricing.discountAmount || 0
      };
      
      const response = await createBookingMutation.mutateAsync(payload);
      toast.success("Booking submitted successfully!");
      
      // Pass the booking ID to the success page via query param
      const bookingId = response.data?.id || response.data?.booking_id || 'preview';
      router.push(`/booking/${cafeId}/success-preview?bookingId=${bookingId}`);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm booking.");
      setIsSubmitting(false);
    }
  };

  if (cafeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
      </div>
    );
  }

  // Double check state
  if (!state.selectedPackage || !state.selectedDate || !state.selectedTimeSlot) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24 lg:pb-12 pt-6">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.push(`/booking/${cafeId}`)}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Review & Confirm</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 relative items-start">
          
          {/* Main Review Area */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Review Cards */}
            <BookingReview cafe={cafe} />
            <CancellationPolicy />

            {/* Acknowledge rules */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex gap-4 text-yellow-800">
               <AlertCircle className="shrink-0 mt-0.5" />
               <div className="text-sm">
                 <h4 className="font-bold mb-1">House Rules</h4>
                 <p>By selecting the button below, I agree to the House Rules, Ground Rules for Guests, and Fahara's Rebooking and Refund Policy.</p>
               </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-[var(--color-border)]">
              <button 
                onClick={() => router.push(`/booking/${cafeId}`)}
                className="px-6 py-3 font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Back to Edit
              </button>
              <button 
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-8 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-secondary)] transition-colors shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                Confirm Booking
              </button>
            </div>
            
          </div>
          
          {/* Right Summary Column */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-6 space-y-6">
            <BookingSummary cafe={cafe} />
            <CouponBox />
            <PriceSummary />
          </div>

        </div>
      </div>
    </div>
  );
}
