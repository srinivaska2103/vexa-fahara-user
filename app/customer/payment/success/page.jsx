'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, useRef } from 'react';
import PaymentSuccessCard from '@/app/components/payment/PaymentSuccessCard';
import { paymentService } from '@/services/payment.service';
import { bookingService } from '@/services/booking.service';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import CustomerNavbar from '@/app/components/layout/CustomerNavbar';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('orderId');
  const bookingId = searchParams.get('bookingId') || searchParams.get('booking_id');
  const razorpayPaymentId = searchParams.get('razorpay_payment_id') || searchParams.get('paymentId');
  const razorpaySignature = searchParams.get('razorpay_signature') || searchParams.get('signature');
  const idToVerify = orderId || bookingId;
  
  const [status, setStatus] = useState('loading');
  const [details, setDetails] = useState(null);

  const paramsRef = useRef({ orderId, bookingId, razorpayPaymentId, razorpaySignature, idToVerify });
  paramsRef.current = { orderId, bookingId, razorpayPaymentId, razorpaySignature, idToVerify };

  useEffect(() => {
    const { orderId: currentOrderId, bookingId: currentBookingId, razorpayPaymentId: currentPayId, razorpaySignature: currentSig, idToVerify: currentVerifyId } = paramsRef.current;

    if (!currentVerifyId) {
      setStatus('error');
      return;
    }
    
    const verify = async () => {
      try {
        // Fetch booking record from backend API to ensure total amount is retrieved
        let fetchedBooking = null;
        if (currentBookingId || currentVerifyId) {
          try {
            const bRes = await bookingService.getBookingById(currentBookingId || currentVerifyId);
            fetchedBooking = bRes?.data || bRes;
          } catch (e) {
            console.warn('Booking fetch fallback warning:', e);
          }
        }

        const response = await paymentService.verifyPayment({
          orderId: currentOrderId,
          bookingId: currentBookingId,
          razorpay_order_id: currentOrderId,
          razorpay_payment_id: currentPayId,
          razorpay_signature: currentSig
        });
        const resultData = response?.data || response;
        const pDetails = resultData?.paymentDetails || resultData?.data?.paymentDetails;

        const resolvedAmount = parseFloat(
          pDetails?.amount || 
          resultData?.amount || 
          fetchedBooking?.total || 
          fetchedBooking?.amount || 
          fetchedBooking?.grandTotal || 
          fetchedBooking?.subtotal || 
          fetchedBooking?.price || 
          0
        );

        const resolvedBookingId = pDetails?.bookingNumber || pDetails?.bookingId || fetchedBooking?.booking_number || currentBookingId || currentVerifyId;
        const resolvedTxnId = pDetails?.transactionId || currentOrderId || fetchedBooking?.payment_id || currentVerifyId;

        setDetails({
          bookingId: resolvedBookingId,
          transactionId: resolvedTxnId,
          amount: resolvedAmount,
          date: pDetails?.date || fetchedBooking?.created_at || new Date().toISOString()
        });
        setStatus('success');
      } catch (error) {
        console.error('Payment verification error:', error);
        if (currentBookingId || currentOrderId) {
          let fallbackAmount = 0;
          try {
            const bRes = await bookingService.getBookingById(currentBookingId || currentOrderId);
            const bData = bRes?.data || bRes;
            fallbackAmount = parseFloat(bData?.total || bData?.amount || bData?.grandTotal || 0);
          } catch (e) {}

          setDetails({
            bookingId: currentBookingId || currentOrderId,
            transactionId: currentOrderId || currentBookingId,
            amount: fallbackAmount,
            date: new Date().toISOString()
          });
          setStatus('success');
        } else {
          setStatus('error');
        }
      }
    };
    
    verify();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#6F4E37] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#6F4E37] font-black text-sm">Verifying your payment...</p>
        </div>
      </div>
    );
  }
  
  if (status === 'error' || !details) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-3 sm:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-9 border border-stone-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.08)] text-center max-w-xl mx-auto w-full relative overflow-hidden font-sans"
        >
          {/* Top Decorative Ambient Aura */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Glowing Error Badge Icon */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="absolute inset-0 rounded-full bg-rose-500/15 animate-ping duration-1000" />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-20 h-20 sm:w-22 sm:h-22 bg-gradient-to-tr from-rose-100 via-rose-50 to-rose-100 text-rose-600 rounded-3xl flex items-center justify-center shadow-md border border-rose-200/80 relative z-10"
            >
              <XCircle size={44} className="drop-shadow-xs" />
            </motion.div>
          </div>
          
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2.5">
              Verification Notice
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">Payment Verification Issue</h2>
            <p className="text-stone-500 text-xs sm:text-sm font-medium mt-2 max-w-md mx-auto leading-relaxed">
              We couldn&apos;t verify your payment confirmation. The transaction may have been cancelled, timed out, or encountered an issue during processing.
            </p>
          </div>
          
          {/* Troubleshooting Steps Card */}
          <div className="bg-gradient-to-br from-rose-50/80 via-rose-50/40 to-stone-50/60 rounded-3xl p-5 sm:p-6 mb-7 text-left border border-rose-100/90 shadow-2xs space-y-3">
            <h3 className="font-black text-xs sm:text-sm text-rose-900 tracking-wide uppercase flex items-center gap-2">
              <span>Troubleshooting Steps</span>
            </h3>
            <div className="space-y-2 text-xs font-bold text-stone-700">
              <div className="flex items-start gap-2.5 bg-white/80 p-2.5 rounded-2xl border border-rose-100/60 shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">1</span>
                <span>Check your bank or UPI app statement for debit confirmation</span>
              </div>
              <div className="flex items-start gap-2.5 bg-white/80 p-2.5 rounded-2xl border border-rose-100/60 shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">2</span>
                <span>Ensure your internet network connection was stable</span>
              </div>
              <div className="flex items-start gap-2.5 bg-white/80 p-2.5 rounded-2xl border border-rose-100/60 shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">3</span>
                <span>Re-try booking confirmation or pick another payment slot</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => window.location.reload()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FFF8F0] border border-[#DDB892]/60 hover:border-[#6F4E37] text-[#6F4E37] py-3.5 px-5 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-2xs hover:shadow-md"
            >
              <RefreshCcw size={16} />
              <span>Try Again</span>
            </motion.button>

            <Link href="/customer/cafe" className="flex-1">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white py-3.5 px-5 rounded-2xl font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Back to Cafes</span>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-3 sm:p-6">
      <PaymentSuccessCard 
        bookingId={details?.bookingNumber || details?.bookingId || bookingId || 'FAH-BOOKING'}
        transactionId={details?.transactionId || orderId || 'TXN-' + (bookingId || '').substring(0, 8)}
        amount={parseFloat(details?.amount || 0)}
        date={details?.date ? new Date(details.date).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : new Date().toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        })}
      />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-16">
      <CustomerNavbar showSearch={true} showViewToggles={false} />
      <main className="container mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-full overflow-x-hidden">
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center font-black text-sm text-[#6F4E37]">Loading...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
