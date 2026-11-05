'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  CreditCard, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Receipt,
  Store,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderRefundTracker({ refundData, orderNumber, onRefresh }) {
  if (!refundData) return null;

  const {
    restaurantName,
    originalPaymentAmount,
    refundAmount,
    paymentMethod,
    refundId,
    gatewayRefundId,
    cancellationDate,
    refundStatus,
    timeline = []
  } = refundData;

  const isProcessed = refundStatus === 'PROCESSED' || refundStatus === 'SUCCESS';
  const isFailed = refundStatus === 'FAILED';
  const isPending = !isProcessed && !isFailed && refundStatus !== 'NOT_APPLICABLE';

  return (
    <div className="bg-white rounded-3xl border border-red-100 p-5 sm:p-7 shadow-xs space-y-6 font-sans">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-[#FFF5F5] text-[#ED0014] text-[10px] font-black uppercase tracking-wider border border-red-200">
              Refund & Cancellation Status
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#1E1E1E]">Automated Refund Tracking</h2>
          <p className="text-xs text-stone-500 font-semibold mt-0.5">
            Real-time status synced with payment gateway.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
            isProcessed
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : isFailed
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isProcessed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />}
            <span>{isProcessed ? 'Refund Processed' : isFailed ? 'Refund Under Review' : 'Refund In Progress'}</span>
          </span>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FFF5F5] p-3.5 rounded-2xl border border-red-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">Refund Amount</span>
          <span className="text-sm sm:text-base font-black text-[#ED0014] mt-0.5 block">
            ₹{Number(refundAmount || originalPaymentAmount || 0).toFixed(2)}
          </span>
        </div>

        <div className="bg-[#FFF5F5] p-3.5 rounded-2xl border border-red-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">Original Paid</span>
          <span className="text-sm sm:text-base font-black text-[#1E1E1E] mt-0.5 block">
            ₹{Number(originalPaymentAmount || 0).toFixed(2)}
          </span>
        </div>

        <div className="bg-[#FFF5F5] p-3.5 rounded-2xl border border-red-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">Payment Mode</span>
          <span className="text-xs sm:text-sm font-black text-[#1E1E1E] mt-0.5 block truncate">
            {paymentMethod || 'Online (Razorpay)'}
          </span>
        </div>

        <div className="bg-[#FFF5F5] p-3.5 rounded-2xl border border-red-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">Gateway Ref ID</span>
          <span className="text-xs font-mono font-bold text-[#ED0014] mt-0.5 block truncate">
            {gatewayRefundId || refundId || 'In Progress'}
          </span>
        </div>
      </div>

      {/* Status Alert Banner */}
      {isPending && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-semibold">
            Your refund is being processed by the payment gateway. Bank settlements typically reflect in <strong>5–7 working days</strong>.
          </p>
        </div>
      )}

      {isFailed && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-semibold">
            Gateway encountered a settlement delay. Our finance team is reviewing this refund manually and will process it directly to your bank account.
          </p>
        </div>
      )}

      {/* Visual Refund Progress Timeline */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#1E1E1E]">
          Refund Progress Timeline
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-red-200">
          {timeline.map((step, idx) => {
            const isDone = step.completed;
            const isStepFailed = step.failed;

            return (
              <div key={idx} className="relative space-y-1">
                {/* Step Circle Indicator */}
                <div className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                  isStepFailed 
                    ? 'bg-rose-600 ring-2 ring-rose-200'
                    : isDone
                    ? 'bg-[#ED0014] ring-2 ring-red-100'
                    : 'bg-stone-300'
                }`} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className={`text-xs font-black ${isDone ? 'text-[#1E1E1E]' : 'text-stone-400'}`}>
                    {step.title}
                  </span>
                  {step.timestamp && (
                    <span className="text-[10px] font-bold text-stone-500">
                      {new Date(step.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-stone-500 font-medium">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

