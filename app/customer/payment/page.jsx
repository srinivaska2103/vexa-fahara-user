'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PaymentSummary from '@/app/components/payment/PaymentSummary';
import LoadingPayment from '@/app/components/payment/LoadingPayment';
import { bookingService } from '@/services/booking.service';
import { paymentService } from '@/services/payment.service';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  const [booking, setBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setIsLoading(false);
      return;
    }
    const fetchBooking = async () => {
      try {
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response.data);
      } catch (error) {
        toast.error("Failed to load booking details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleProceedPayment = async (selectedMethod) => {
    if (!bookingId) return;
    setIsProcessing(true);
    try {
      // 1. Create order on our backend via Razorpay
      const response = await paymentService.createOrder(bookingId);
      const paymentInfo = response.data;
      
      // 2. Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }
      
      // 3. Open Razorpay Checkout Modal
      const options = {
        key: paymentInfo.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency || 'INR',
        name: 'FAHARA',
        description: `Booking #${bookingId.substring(0, 8)}`,
        order_id: paymentInfo.orderId,
        handler: async function (res) {
          try {
            await paymentService.verifyPayment({
              orderId: paymentInfo.orderId,
              razorpay_order_id: res.razorpay_order_id || paymentInfo.orderId,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
              bookingId: bookingId
            });
            toast.success('Payment completed successfully!');
          } catch (err) {
            console.error('Verification error:', err);
          } finally {
            const pId = res?.razorpay_payment_id ? `&razorpay_payment_id=${res.razorpay_payment_id}` : '';
            const sig = res?.razorpay_signature ? `&razorpay_signature=${res.razorpay_signature}` : '';
            router.push(`/customer/payment/success?bookingId=${bookingId}&order_id=${paymentInfo.orderId}${pId}${sig}`);
          }
        },
        prefill: {
          name: booking?.users?.name || '',
          email: booking?.users?.email || '',
          contact: booking?.users?.phone || '',
        },
        theme: {
          color: '#6F4E37',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast('Payment window closed.', { icon: 'ℹ️' });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (res) {
        setIsProcessing(false);
        toast.error(res.error?.description || 'Payment failed.');
      });
      rzp.open();
      
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error(error.response?.data?.message || 'Payment initiation failed.');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#6F4E37] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#A67B5B] font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoadingPayment message="Securely processing your payment. Please do not refresh or close this page." />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#2C1810]">Booking Not Found</h2>
          <p className="text-[#A67B5B] mt-2">We could not find the booking you are looking for.</p>
        </div>
      </div>
    );
  }

  const formatTime = (timeVal) => {
    if (!timeVal) return '';
    const dateObj = new Date(timeVal);
    if (isNaN(dateObj.getTime())) return String(timeVal);
    return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
  };

  const startTimeFormatted = formatTime(booking.start_time);
  const endTimeFormatted = formatTime(booking.end_time);
  const timeDisplay = endTimeFormatted ? `${startTimeFormatted} - ${endTimeFormatted}` : startTimeFormatted;

  // Resolve inclusions
  let inclusions = [];
  if (booking.packages) {
    const pkg = booking.packages;
    if (pkg.food) inclusions.push('Food & Beverages');
    if (pkg.cake) inclusions.push('Custom Celebration Cake');
    if (pkg.decoration) inclusions.push('Event Decoration Setup');
    if (pkg.music) inclusions.push('Background Music');
    if (Array.isArray(pkg.inclusions)) inclusions.push(...pkg.inclusions);
    else if (typeof pkg.inclusions === 'string' && pkg.inclusions.trim()) inclusions.push(...pkg.inclusions.split(','));
  }

  const bookingData = {
    bookingNumber: booking.booking_number,
    cafeName: booking.cafes?.name,
    cafeImage: booking.cafes?.cover_image || booking.cafes?.images?.[0] || null,
    address: booking.cafes?.address || booking.cafes?.city || '',
    date: new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: timeDisplay,
    duration: `${booking.hours} ${Number(booking.hours) === 1 ? 'Hour' : 'Hours'}`,
    guests: booking.total_persons,
    eventCompany: booking.event_services?.users?.event_management_profiles?.company_name || booking.event_services?.users?.name || null,
    eventPackage: booking.packages?.package_name || booking.packages?.name || booking.event_services?.service_name || null,
    packageInclusions: inclusions.filter(Boolean),
    specialRequest: booking.special_request || null,
    eventSpecialRequest: booking.event_special_request || null,
    customerName: booking.users?.name || null,
    customerEmail: booking.users?.email || null,
    customerPhone: booking.users?.phone || null,
    managerName: booking.cafes?.users?.name || null,
    managerPhone: booking.cafes?.users?.phone || null,
  };

  const priceData = {
    cafeCharges: parseFloat(booking.cafe_amount) || 0,
    eventCharges: parseFloat(booking.event_service_amount) || 0,
    additionalCharges: (parseFloat(booking.food_amount) || 0) + (parseFloat(booking.decoration_amount) || 0) + (parseFloat(booking.extra_person_amount) || 0),
    discount: parseFloat(booking.discount) || 0,
    subtotal: parseFloat(booking.subtotal) || 0,
    platformFee: parseFloat(booking.fahara_service_charge) || 0,
    transactionFee: parseFloat(booking.transaction_fee) || 0,
    gst: parseFloat(booking.gst) || 0,
    grandTotal: parseFloat(booking.total) || 0,
    isCafePackage: !!booking.package_id && !booking.event_services,
    eventPackageName: booking.packages?.package_name || ''
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PaymentSummary 
        bookingData={bookingData} 
        priceData={priceData} 
        onProceed={handleProceedPayment} 
      />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <FaharaInteractiveLoader 
        message="Loading Payment Summary & Checkout..." 
        badgeTag="FAHARA PAYMENTS" 
        fullScreen={true} 
      />
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
