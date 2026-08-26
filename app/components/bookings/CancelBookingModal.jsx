import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function CancelBookingModal({ isOpen, onClose, onConfirm, booking, isProcessing }) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden z-10"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#2C1810]">Cancel Booking</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 text-sm">Cancellation Policy</h4>
                <p className="text-sm text-red-700 mt-1">
                  Cancellations made less than 24 hours before the booking time may not be fully refunded. 
                  Your booking is scheduled for {format(new Date(booking.booking_date), 'MMM dd')} at {booking.start_time.slice(0, 5)}.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">
                  Reason for cancellation (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-[#E8DED5] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#A67B5B]/50 resize-none h-24"
                  placeholder="Please tell us why you are cancelling..."
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 border border-[#E8DED5] rounded-xl text-[#2C1810] font-semibold hover:bg-gray-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => onConfirm(reason)}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-red-600 rounded-xl text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {isProcessing ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
