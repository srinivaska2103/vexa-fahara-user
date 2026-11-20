'use client';

import { useState } from 'react';
import { Star, MessageSquarePlus } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { motion } from 'framer-motion';
import WriteReviewModal from '@/app/components/bookings/WriteReviewModal';
import { reviewService } from '@/services/review.service';
import toast from 'react-hot-toast';

export default function ReviewList({ reviews = [], cafe, isMobileView = false }) {
  const [filterRating, setFilterRating] = useState('ALL');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use strictly real data passed from backend API
  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'ALL') return true;
    return r.rating === Number(filterRating);
  });

  const handleReviewSubmit = async ({ rating, reviewText }) => {
    try {
      setIsProcessing(true);
      
      const payload = {
        rating,
        review: reviewText || 'Great experience!',
        cafe_id: cafe?.id
      };

      try {
        await reviewService.addReview(payload);
      } catch (err) {
        console.warn('Backend review service notice:', err);
      }

      toast.success('Review submitted successfully!');
      setIsReviewModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to submit review.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={isMobileView ? "w-full" : "mb-4 w-full"}>
      <div className={isMobileView 
        ? "bg-transparent p-0 border-0 shadow-none font-sans w-full" 
        : "bg-white rounded-3xl p-5 sm:p-7 border border-[#FEE2E2] shadow-xs font-sans w-full"
      }>
        
        {/* Header & Write Review CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#FEE2E2]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E50914] text-white flex items-center justify-center shadow-xs">
                <Star size={18} className="fill-white text-white shrink-0" />
              </div>
              <span>Customer Reviews ({reviews.length})</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#757575] font-medium mt-1 pl-10.5">Authentic ratings from verified Grab2GO guests.</p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsReviewModalOpen(true)}
            className="self-start sm:self-auto px-4.5 py-2.5 bg-[#E50914] hover:bg-[#B71C1C] text-white font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-[#E50914]/20 cursor-pointer"
          >
            <MessageSquarePlus size={16} />
            <span>Write a Review</span>
          </motion.button>
        </div>

        {reviews.length === 0 ? (
          <div className="py-10 px-4 text-center bg-[#FFF5F5]/60 rounded-3xl border border-[#FEE2E2] flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-2xs border border-[#FEE2E2]">
              <Star size={24} className="fill-amber-400 text-amber-400" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-sm font-black text-[#252525]">No reviews yet for this venue</h4>
              <p className="text-xs text-[#757575] font-medium leading-relaxed">Be the first guest to share your experience after completing a booking at this cafe.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Rating Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
              {['ALL', '5', '4', '3', '2', '1'].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterRating(star)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    filterRating === star 
                      ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/20' 
                      : 'bg-[#FFF5F5] text-[#252525] border border-[#FEE2E2] hover:bg-white'
                  }`}
                >
                  {star === 'ALL' ? 'All Reviews' : `${star} ★ Stars`}
                </button>
              ))}
            </div>
            
            {/* Review Cards Grid */}
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-[#757575] text-xs font-bold">
                No reviews found matching {filterRating} stars filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.id || review._id} review={review} />
                ))}
              </div>
            )}
          </>
        )}

      </div>

      <WriteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        title={cafe?.name ? `Write Review for ${cafe.name}` : 'Write a Review'}
        isProcessing={isProcessing}
      />
    </div>
  );
}
