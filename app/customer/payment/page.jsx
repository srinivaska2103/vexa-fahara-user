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

  const [pricingBreakdown, setPricingBreakdown] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setIsLoading(false);
      return;
    }
    const fetchBookingData = async () => {
      try {
        const [bookingRes, pricingRes] = await Promise.all([
          bookingService.getBookingById(bookingId),
          bookingService.getBookingPricing(bookingId).catch(() => null)
        ]);
        const pricingObj = pricingRes?.data?.data || pricingRes?.data || null;
        setBooking(bookingRes?.data || bookingRes);
        if (pricingObj) {
          setPricingBreakdown(pricingObj);
        }
      } catch (error) {
        toast.error("Failed to load booking details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingData();
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
  const guestCount = Number(booking?.total_persons || 1);
  const parseInclusionsObj = (inc, isTemplate = false) => {
    if (!inc || typeof inc !== 'object') return;

    const catMap = [
      { key: 'food_items', activeKey: 'food', label: 'Food & Catering' },
      { key: 'cake_items', activeKey: 'cake', label: 'Celebration Cake' },
      { key: 'decoration_items', activeKey: 'decoration', label: 'Decoration' },
      { key: 'music_items', activeKey: 'music', label: 'Music' },
      { key: 'other_items', activeKey: 'other', label: 'Other Inclusions' }
    ];

    let processedAnyCategory = false;

    catMap.forEach(({ key, activeKey, label }) => {
      const isActive = inc[activeKey] !== undefined ? Boolean(inc[activeKey]) : true;
      if (isActive && Array.isArray(inc[key]) && inc[key].length > 0) {
        processedAnyCategory = true;
        let itemsToProcess = [];
        if (Array.isArray(inc[key])) {
          if (inc[key].length === 1) {
            itemsToProcess = [inc[key][0]];
          } else if (Array.isArray(inc.selectedInclusions) && inc.selectedInclusions.length > 0) {
            const matched = inc[key].filter(item => {
              const itemName = typeof item === 'string' ? item : (item.name || item.tierName || item.tier || '');
              if (!itemName) return false;
              const target = String(itemName).toLowerCase();
              return inc.selectedInclusions.some(str => {
                const s = String(str).toLowerCase();
                if (!s.includes(label.toLowerCase())) return false;
                const afterColon = s.includes(':') ? s.split(':')[1].trim() : s;
                return afterColon.includes(target) || target === afterColon;
              });
            });
            if (matched.length > 0) itemsToProcess = matched;
          }
        }

        if (itemsToProcess.length === 0 && inc[key].length === 1) {
          itemsToProcess = [inc[key][0]];
        }

        itemsToProcess.forEach(item => {
          if (typeof item === 'string') {
            inclusions.push(`${label}: ${item}`);
          } else if (item && typeof item === 'object') {
            const rawName = item.name || item.tierName || item.tier || '';
            const name = rawName ? (rawName.charAt(0).toUpperCase() + rawName.slice(1)) : '';
            const price = Number(item.price || item.unitPrice || 0);
            const pType = String(item.pricing_type || item.pricingType || (key === 'food_items' ? 'PER_GUEST' : 'FIXED')).toUpperCase();
            const itemAmt = pType === 'PER_GUEST' ? price * guestCount : price;
            const desc = item.description || item.desc || '';
            const descStr = (desc && desc.toLowerCase() !== name.toLowerCase()) ? ` — ${desc}` : '';

            if (pType === 'PER_GUEST') {
              inclusions.push(`${label}: ${name}${descStr} (+₹${price}/guest × ${guestCount} guests = ₹${itemAmt})`);
            } else if (pType === 'PER_UNIT') {
              const qty = Math.max(1, Number(item.quantity || item.qty || 1));
              inclusions.push(`${label}: ${name}${descStr} (+₹${price}/unit × ${qty} = ₹${itemAmt})`);
            } else {
              inclusions.push(`${label}: ${name}${descStr} (+₹${price})`);
            }
          }
        });
      }
    });

    if (!processedAnyCategory && Array.isArray(inc.selectedInclusions) && inc.selectedInclusions.length > 0) {
      inclusions.push(...inc.selectedInclusions);
    }
  };

  if (booking.inclusions) {
    let inc = booking.inclusions;
    if (typeof inc === 'string') {
      try { inc = JSON.parse(inc); } catch (e) { inc = []; }
    }
    if (Array.isArray(inc)) {
      inc.forEach(item => {
        if (typeof item === 'string') {
          inclusions.push(item);
        } else if (item && typeof item === 'object') {
          const rawName = item.item_name || item.name || 'Item';
          const rawTier = item.tier_name || item.tierName || '';
          const formattedTier = rawTier ? (rawTier.charAt(0).toUpperCase() + rawTier.slice(1).toLowerCase()) : '';
          const desc = item.description || item.desc || '';
          const price = Number(item.unit_price ?? item.unitPrice ?? item.price ?? 0);
          const pType = String(item.pricing_type || item.pricingType || 'FIXED').toUpperCase();
          const qty = Number(item.quantity || 1);
          const itemAmt = Number(item.amount ?? (pType === 'PER_GUEST' ? price * guestCount : price * qty));
          const descStr = (desc && desc.toLowerCase() !== formattedTier.toLowerCase()) ? ` (${desc})` : '';
          const tierStr = formattedTier ? `: ${formattedTier}${descStr}` : (descStr ? `: ${descStr}` : '');
          const calcStr = pType === 'PER_GUEST' 
            ? `₹${price.toFixed(2)} × ${guestCount} guests = ₹${itemAmt.toFixed(2)}` 
            : `₹${price.toFixed(2)} × ${qty} = ₹${itemAmt.toFixed(2)}`;
          inclusions.push(`${rawName}${tierStr} • ${calcStr}`);
        }
      });
    } else {
      parseInclusionsObj(inc, false);
    }
  }

  if (inclusions.length === 0 && booking.packages) {
    const pkg = booking.packages;
    let pkgInc = pkg.inclusions;
    if (typeof pkgInc === 'string') {
      try { pkgInc = JSON.parse(pkgInc); } catch (e) { pkgInc = null; }
    }
    parseInclusionsObj(pkgInc, true);

    if (inclusions.length === 0) {
      if (pkgInc?.food || pkg.food) inclusions.push('Food & Beverages');
      if (pkgInc?.cake || pkg.cake) inclusions.push('Custom Celebration Cake');
      if (pkgInc?.decoration || pkg.decoration) inclusions.push('Event Decoration Setup');
      if (pkgInc?.music || pkg.music) inclusions.push('Background Music');
    }
  }

  const pricingInclusionStrings = (() => {
    if (!pricingBreakdown) return null;
    const cafeItems = pricingBreakdown.cafe?.items || pricingBreakdown.cafeInclusions || [];
    const eventItems = pricingBreakdown.event?.items || pricingBreakdown.eventInclusions || [];
    // Include ALL items — cafe charge is shown as a top-level item too
    const allItems = [...cafeItems, ...eventItems];
    if (allItems.length === 0) return null;
    return allItems.map(i => {
      const isCafeCharge = i.itemType === 'CAFE_CHARGE';
      const name = i.name || i.itemName || 'Item';
      const selectedTier = i.selectedTier || {};
      const rawTier = selectedTier.level || selectedTier.name || i.tierLevel || i.tierName || i.level || null;
      const formattedTier = rawTier ? (rawTier.charAt(0).toUpperCase() + rawTier.slice(1).toLowerCase()) : '';
      const desc = i.description || '';
      const descPart = !isCafeCharge && desc ? ` (${desc})` : '';
      const tierStr = formattedTier ? ` (${formattedTier}${descPart})` : (descPart ? ` (${descPart})` : '');
      // Use pre-computed calculation string from backend if available
      const calc = i.calculation || (isCafeCharge ? `₹${(i.unitPrice || 0).toFixed(2)} total` : `₹${(i.unitPrice || 0).toFixed(2)} × ${i.guestCount || i.quantity || 1} = ₹${(i.amount || 0).toFixed(2)}`);
      return `${name}${tierStr} • ${calc}`;
    });
  })();

  const resolvedInclusions = (pricingInclusionStrings && pricingInclusionStrings.length > 0)
    ? pricingInclusionStrings
    : inclusions.filter(Boolean);

  const bookingData = {
    bookingNumber: booking.booking_number,
    cafeName: booking.cafes?.name,
    cafeImage: booking.cafes?.cover_image || booking.cafes?.images?.[0] || null,
    address: booking.cafes?.address || booking.cafes?.city || '',
    date: (() => {
      if (!booking.booking_date) return '';
      const d = new Date(booking.booking_date);
      return isNaN(d.getTime()) ? String(booking.booking_date) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    })(),
    time: timeDisplay,
    duration: `${booking.hours} ${Number(booking.hours) === 1 ? 'Hour' : 'Hours'}`,
    guests: booking.total_persons,
    eventCompany: booking.event_services?.users?.event_management_profiles?.company_name || booking.event_services?.users?.name || null,
    eventPackage: booking.packages?.package_name || booking.packages?.name || booking.event_services?.service_name || null,
    packageInclusions: resolvedInclusions,
    specialRequest: booking.special_request || null,
    eventSpecialRequest: booking.event_special_request || null,
    customerName: booking.users?.name || null,
    customerEmail: booking.users?.email || null,
    customerPhone: booking.users?.phone || null,
    managerName: booking.cafes?.users?.name || null,
    managerPhone: booking.cafes?.users?.phone || null,
  };

  const priceData = pricingBreakdown ? {
    ...pricingBreakdown,
    platformFee: pricingBreakdown.platformFee,
    transactionFee: pricingBreakdown.transactionFee,
    gst: pricingBreakdown.gst,
    packageInclusions: resolvedInclusions,
    inclusions: resolvedInclusions
  } : {
    cafeCharges: parseFloat(booking.cafe_amount) || 0,
    eventCharges: parseFloat(booking.event_service_amount) || 0,
    additionalCharges: (parseFloat(booking.food_amount) || 0) + (parseFloat(booking.decoration_amount) || 0) + (parseFloat(booking.extra_person_amount) || 0),
    discount: parseFloat(booking.discount) || 0,
    subtotal: parseFloat(booking.subtotal) || 0,
    platformFee: parseFloat(booking.fahara_service_charge) || 0,
    transactionFee: parseFloat(booking.transaction_fee) || 0,
    gst: parseFloat(booking.gst) || 0,
    grandTotal: parseFloat(booking.total) || 0,
    isCafePackage: !!booking.package_id || !booking.event_services,
    packageInclusions: resolvedInclusions,
    inclusions: resolvedInclusions
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
