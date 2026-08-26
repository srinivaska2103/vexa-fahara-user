import React from 'react';
import { Check, Clock, X, Circle, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function BookingTimeline({ booking }) {
  const isCancelled = booking.booking_status === 'CANCELLED' || booking.booking_status === 'REJECTED';
  
  let isCompleted = booking.booking_status === 'COMPLETED';
  if (booking.booking_status === 'CONFIRMED') {
    try {
      const bDate = new Date(booking.booking_date);
      const t = booking.end_time;
      const timeStr = t.includes('T') ? t.split('T')[1].substring(0, 5) : t.substring(0, 5);
      const [h, m] = timeStr.split(':');
      bDate.setHours(h, m, 0, 0);
      if (new Date() > bDate) {
        isCompleted = true;
      }
    } catch (e) {
      // fallback
    }
  }

  const paymentRecord = booking.payments && booking.payments.length > 0 ? booking.payments[0] : null;
  const refundRecord = paymentRecord?.payment_refunds && paymentRecord.payment_refunds.length > 0 ? paymentRecord.payment_refunds[0] : null;
  const isRefunded = booking.payment_status === 'REFUNDED' || booking.payment_status === 'PARTIALLY_REFUNDED' || refundRecord?.refund_status === 'SUCCESS';
  
  const refundAmount = refundRecord?.refund_amount || booking.refund_amount || booking.total_amount || 0;
  const refundRef = refundRecord?.razorpay_refund_id || refundRecord?.cashfree_refund_id || paymentRecord?.gateway_order_id || 'Razorpay Refund';

  const isConfirmed = booking.booking_status === 'CONFIRMED' || isCompleted;
  const isPaid = booking.payment_status === 'PAID' || isRefunded || isConfirmed;

  const steps = [
    {
      title: 'Booking Created',
      description: format(new Date(booking.created_at || new Date()), 'PPp'),
      status: 'completed',
      icon: Check
    },
    {
      title: 'Payment',
      description: isRefunded ? 'Refunded' : (isPaid ? 'Payment successful' : 'Pending payment'),
      status: isPaid ? 'completed' : (isCancelled ? 'cancelled' : 'current'),
      icon: isPaid ? Check : Clock
    },
    {
      title: 'Confirmation',
      description: isConfirmed ? 'Confirmed by host' : (isCancelled ? 'Booking cancelled' : 'Pending host confirmation'),
      status: isConfirmed ? 'completed' : (isCancelled ? 'cancelled' : (isPaid ? 'current' : 'upcoming')),
      icon: isConfirmed ? Check : (isCancelled ? X : Clock)
    }
  ];

  if (isCancelled) {
    if (isRefunded) {
      steps.push({
        title: 'Refund Processed',
        description: `₹${Number(refundAmount).toFixed(2)} refunded via Razorpay (${refundRef}). Transferred to account (3-5 days).`,
        status: 'refunded',
        icon: RotateCcw
      });
    } else if (booking.payment_status === 'PAID') {
      steps.push({
        title: 'Non-Refundable',
        description: 'Cancelled within 9-hour slot window (non-refundable as per policy).',
        status: 'cancelled',
        icon: AlertTriangle
      });
    } else {
      steps.push({
        title: 'Refund Status',
        description: 'No refund required (Unpaid / Pending booking).',
        status: 'cancelled',
        icon: X
      });
    }
  } else if (isCompleted || isConfirmed) {
    steps.push({
      title: 'Completed',
      description: isCompleted ? 'Booking completed' : 'Awaiting completion',
      status: isCompleted ? 'completed' : 'upcoming',
      icon: isCompleted ? Check : Circle
    });
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans">
      <h3 className="text-xl font-black text-[#2C1810] mb-5 tracking-tight">Booking Timeline</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {steps.map((step, stepIdx) => (
            <li key={step.title}>
              <div className="relative pb-7">
                {stepIdx !== steps.length - 1 ? (
                  <span
                    className={cn(
                      "absolute top-4 left-3.5 -ml-px h-full w-0.5 transition-colors",
                      step.status === 'completed' ? "bg-[#6F4E37]" : "bg-stone-200"
                    )}
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3.5 items-start">
                  <div>
                    <span
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center ring-4 ring-white shadow-2xs transition-all",
                        step.status === 'completed' ? "bg-gradient-to-r from-[#4A2C11] to-[#6F4E37]" : 
                        step.status === 'refunded' ? "bg-gradient-to-r from-emerald-600 to-teal-600" :
                        step.status === 'current' ? "bg-[#6F4E37]" : 
                        step.status === 'cancelled' ? "bg-rose-600" :
                        "bg-stone-200 text-stone-400"
                      )}
                    >
                      <step.icon className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className={cn(
                      "text-xs sm:text-sm font-black tracking-tight",
                      (step.status === 'completed' || step.status === 'current' || step.status === 'refunded') ? "text-[#2C1810]" : "text-stone-400"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-[11px] font-bold text-stone-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
