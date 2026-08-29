import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import ModernDatePicker from '@/app/components/common/ModernDatePicker';
import ModernTimePicker from '@/app/components/common/ModernTimePicker';

export default function RescheduleBookingModal({ isOpen, onClose, onConfirm, booking, isProcessing }) {
  const getInitialDate = () => {
    const d = booking?.booking_date || booking?.date;
    if (!d) return '';
    try {
      const parsed = new Date(d);
      return !isNaN(parsed.getTime()) ? format(parsed, 'yyyy-MM-dd') : '';
    } catch (e) {
      return '';
    }
  };

  const getInitialTime = () => {
    const t = booking?.start_time || booking?.booking_time;
    if (!t || typeof t !== 'string') return '';
    if (t.includes('T')) {
      try {
        const parsed = new Date(t);
        return !isNaN(parsed.getTime()) ? format(parsed, 'HH:mm') : '';
      } catch (e) {
        return '';
      }
    }
    return t.substring(0, 5);
  };

  const [date, setDate] = useState(getInitialDate());
  const [time, setTime] = useState(getInitialTime());
  const [guests, setGuests] = useState(booking?.number_of_guests || 1);

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
          className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl z-10"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#2C1810]">Reschedule Booking</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">New Date</label>
                <ModernDatePicker
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  placeholder="Select New Date"
                  minYear={new Date().getFullYear()}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-2">New Time</label>
                  <ModernTimePicker
                    value={time}
                    onChange={(newTime) => setTime(newTime)}
                    placeholder="Select Time"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-2">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8DED5] focus:outline-none focus:ring-2 focus:ring-[#A67B5B]/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 border border-[#E8DED5] rounded-xl text-[#2C1810] font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onConfirm({ date, time, guests })}
                disabled={isProcessing || !date || !time || !guests}
                className="flex-1 py-3 px-4 bg-[#6F4E37] rounded-xl text-white font-semibold hover:bg-[#5A3E2B] transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {isProcessing ? 'Checking...' : 'Check Availability'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
