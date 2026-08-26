'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReviewsStore } from '@/stores/reviews.store';

const REASONS = [
  "Spam",
  "Abusive Content",
  "Fake Review",
  "Irrelevant",
  "Other"
];

export default function ReportReviewModal({ isOpen, onClose, reviewId }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const { reportReview } = useReviewsStore();

  const handleReport = async () => {
    if (!selectedReason) {
      toast.error('Please select a reason for reporting.');
      return;
    }
    
    setIsReporting(true);
    try {
      // Simulate API call since there's no backend endpoint for report
      await new Promise(res => setTimeout(res, 1000));
      reportReview(reviewId);
      toast.success('Review reported successfully. Our team will review it.');
      onClose();
    } catch (error) {
      toast.error('Failed to report review');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col mt-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <Flag className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2C1810]">Report Review</h3>
                  <p className="text-sm text-gray-500">Why are you reporting this?</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {REASONS.map(reason => (
                  <label key={reason} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="reportReason" 
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-4 h-4 text-[#6F4E37] focus:ring-[#6F4E37]"
                    />
                    <span className="text-sm font-medium text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  disabled={isReporting}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  disabled={isReporting}
                  className="flex-1 px-4 py-2 bg-[#6F4E37] text-white font-medium rounded-xl hover:bg-[#5A3E2B] transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isReporting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
