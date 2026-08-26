import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';

import toast from 'react-hot-toast';

export default function WriteReviewModal({ isOpen, onClose, onSubmit, title, isProcessing }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setReviewText('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    onSubmit({ rating, reviewText });
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden z-10 font-sans"
          >
            <div className="p-5 sm:p-6 border-b border-stone-100 flex justify-between items-center bg-[#FFF8F0]">
              <h2 className="text-lg sm:text-xl font-black text-[#2C1810] tracking-tight">{title}</h2>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-black text-[#2C1810] mb-2.5">
                  Select Rating
                </label>
                <div className="flex gap-2 justify-center py-2 bg-stone-50/80 rounded-2xl border border-stone-200/60">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-[#2C1810] mb-2">
                  Your Review <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full border border-stone-200/90 bg-stone-50/80 rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/40 focus:border-[#6F4E37] text-xs sm:text-sm font-semibold text-[#2C1810] resize-none h-28 placeholder:text-stone-400 transition-all"
                  placeholder="Share your experience with the cafe ambiance, food, and service..."
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 border border-stone-200 rounded-2xl text-stone-700 font-black text-xs hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || rating === 0}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] rounded-2xl text-white font-black text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
                >
                  {isProcessing ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
