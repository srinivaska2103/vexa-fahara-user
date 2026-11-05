'use client';

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  Store, 
  Receipt, 
  CreditCard,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CANCELLATION_REASONS = [
  'Ordered by mistake',
  'Changed my mind',
  'Wrong items selected',
  'Restaurant taking too long',
  'Payment issue',
  'Other'
];

export default function OrderCancellationModal({
  isOpen,
  onClose,
  order,
  policy,
  onConfirm,
  isSubmitting
}) {
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [additionalMessage, setAdditionalMessage] = useState('');

  if (!isOpen || !order) return null;

  const isPaid = order.payment_status === 'PAID';
  const expectedRefund = isPaid ? Number(order.total_amount).toFixed(2) : '0.00';
  const isDirect = policy?.canCancelDirectly !== false;

  const handleConfirm = () => {
    onConfirm({
      reason: selectedReason,
      message: additionalMessage.trim() || null
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden font-sans flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-100 bg-[#FFF5F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-[#ED0014]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#1E1E1E]">Cancel Order</h3>
                <span className="text-[11px] font-bold text-[#ED0014]">
                  Order ID: #{order.order_number}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Order & Refund Summary Card */}
            <div className="bg-[#FFF5F5] rounded-2xl p-4 border border-red-100 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-[#1E1E1E] pb-2 border-b border-red-200/60 font-bold">
                <span className="flex items-center gap-1.5 text-stone-600">
                  <Store className="w-4 h-4 text-[#ED0014]" />
                  Restaurant:
                </span>
                <span className="font-black text-[#1E1E1E]">{order.cafes?.name || 'Restaurant'}</span>
              </div>

              <div className="flex justify-between items-center text-[#1E1E1E] pb-2 border-b border-red-200/60 font-bold">
                <span className="flex items-center gap-1.5 text-stone-600">
                  <Receipt className="w-4 h-4 text-[#ED0014]" />
                  Order Amount:
                </span>
                <span className="font-black">₹{Number(order.total_amount).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-[#1E1E1E] pb-2 border-b border-red-200/60 font-bold">
                <span className="flex items-center gap-1.5 text-stone-600">
                  <CreditCard className="w-4 h-4 text-[#ED0014]" />
                  Payment Status:
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                  isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.payment_status}
                </span>
              </div>

              <div className="flex justify-between items-center text-[#1E1E1E] pt-1">
                <span className="font-black text-[#9E0010]">Expected Refund:</span>
                <span className="font-black text-sm text-[#ED0014]">
                  {isPaid ? `₹${expectedRefund}` : 'Not Applicable (Unpaid)'}
                </span>
              </div>
            </div>

            {/* Policy Notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed">
                <span className="font-black block">10-Minute Cancellation Policy</span>
                <p className="text-[11px] text-amber-800">
                  {policy?.isWithin10Minutes
                    ? `You are within the 10-minute cancellation window (${policy.minutesLeft} min remaining). Your cancellation is guaranteed and full automated refund will be initiated.`
                    : isDirect
                      ? 'Your order will be cancelled instantly and an automated gateway refund will be initiated to your original payment method.'
                      : 'The initial 10-minute cancellation window has elapsed and the restaurant is preparing your food. Submitting this request sends it for immediate restaurant approval.'}
                </p>
              </div>
            </div>

            {/* Reason Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-[#1E1E1E] block uppercase tracking-wider">
                Select Reason for Cancellation <span className="text-[#ED0014]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CANCELLATION_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      selectedReason === reason
                        ? 'border-[#ED0014] bg-[#FFF5F5] text-[#ED0014] ring-1 ring-[#ED0014]/30'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                    }`}
                  >
                    <span className="truncate">{reason}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedReason === reason ? 'border-[#ED0014]' : 'border-stone-300'
                    }`}>
                      {selectedReason === reason && <span className="w-1.5 h-1.5 rounded-full bg-[#ED0014]" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Note */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-600 block">
                Additional Comments (Optional)
              </label>
              <textarea
                value={additionalMessage}
                onChange={(e) => setAdditionalMessage(e.target.value)}
                placeholder="Let us know more details about your cancellation..."
                rows={2}
                maxLength={200}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[#ED0014] focus:ring-1 focus:ring-[#ED0014]/20 resize-none"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-white text-xs font-black text-stone-700 transition-colors"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B80012] to-[#ED0014] text-white text-xs font-black shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Confirm Cancellation</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

