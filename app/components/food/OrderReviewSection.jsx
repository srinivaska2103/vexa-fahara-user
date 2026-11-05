'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Utensils, 
  Package, 
  Truck, 
  Store,
  ChevronDown
} from 'lucide-react';
import { reviewService } from '@/services/review.service';
import toast from 'react-hot-toast';

export default function OrderReviewSection({ order }) {
  const [existingReview, setExistingReview] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [foodQualityRating, setFoodQualityRating] = useState(5);
  const [packagingRating, setPackagingRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);

  const fetchExistingReview = async () => {
    if (!order?.id) return;
    try {
      setLoadingCheck(true);
      const res = await reviewService.getOrderReview(order.id);
      if (res?.success && res.data) {
        setExistingReview(res.data);
      }
    } catch (err) {
      // No review yet
    } finally {
      setLoadingCheck(false);
    }
  };

  useEffect(() => {
    fetchExistingReview();
  }, [order?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Please select an overall star rating');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        order_id: order.id,
        cafe_id: order.cafe_id || order.cafes?.id,
        rating: Number(rating),
        review_title: reviewTitle.trim() || undefined,
        review: comment.trim() || undefined,
        food_quality_rating: Number(foodQualityRating),
        packaging_rating: Number(packagingRating),
        delivery_rating: Number(deliveryRating)
      };

      const res = await reviewService.submitOrderReview(payload);
      if (res?.success) {
        toast.success('Thank you! Your review has been submitted.');
        setExistingReview(res.data);
      } else {
        toast.error(res?.message || 'Failed to submit review');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error submitting review';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show for COMPLETED orders
  if (order.order_status !== 'COMPLETED') {
    return null;
  }

  if (loadingCheck) {
    return (
      <div className="bg-white rounded-3xl border border-[#FEE2E2] p-6 text-center text-xs text-[#757575] animate-pulse">
        Checking review eligibility...
      </div>
    );
  }

  // If already reviewed, display the submitted review view
  if (existingReview) {
    return (
      <div className="bg-white rounded-3xl border border-[#FEE2E2] p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FEE2E2] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#252525]">Your Order Review</h3>
              <p className="text-[11px] text-[#757575]">
                Submitted on {existingReview.created_at ? new Date(existingReview.created_at).toLocaleDateString() : 'recently'}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            Verified Purchase Review
          </span>
        </div>

        {/* Rating and Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= (existingReview.rating || 5)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-[#F5F5F5] text-neutral-300'
                }`}
              />
            ))}
            <span className="text-xs font-black text-[#252525] ml-1.5">{existingReview.rating}.0 / 5.0</span>
          </div>

          {existingReview.review_title && (
            <h4 className="text-sm font-black text-[#252525]">{existingReview.review_title}</h4>
          )}

          <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] text-xs text-[#252525] leading-relaxed italic">
            "{existingReview.review || 'No written comment provided.'}"
          </div>
        </div>

        {/* Breakdown tags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {existingReview.food_quality_rating && (
            <div className="p-3 rounded-2xl bg-white border border-[#FEE2E2] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#757575] font-bold">
                <Utensils className="w-3.5 h-3.5 text-[#E50914]" /> Food Quality
              </span>
              <span className="font-black text-[#252525]">{existingReview.food_quality_rating} ★</span>
            </div>
          )}
          {existingReview.packaging_rating && (
            <div className="p-3 rounded-2xl bg-white border border-[#FEE2E2] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#757575] font-bold">
                <Package className="w-3.5 h-3.5 text-[#E50914]" /> Packaging
              </span>
              <span className="font-black text-[#252525]">{existingReview.packaging_rating} ★</span>
            </div>
          )}
          {existingReview.delivery_rating && (
            <div className="p-3 rounded-2xl bg-white border border-[#FEE2E2] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#757575] font-bold">
                <Truck className="w-3.5 h-3.5 text-[#E50914]" /> Delivery / Service
              </span>
              <span className="font-black text-[#252525]">{existingReview.delivery_rating} ★</span>
            </div>
          )}
        </div>

        {/* Owner Reply if present */}
        {existingReview.reply && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
              <Store className="w-4 h-4 text-amber-700" />
              <span>Response from {order.cafes?.name || 'Restaurant Owner'}</span>
              {existingReview.reply_at && (
                <span className="text-[10px] text-amber-700/70 font-normal">
                  • {new Date(existingReview.reply_at).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-xs text-amber-950 leading-relaxed pl-5 font-medium">
              {existingReview.reply}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Review Form
  return (
    <div className="bg-white rounded-3xl border border-[#FEE2E2] p-6 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FEE2E2] pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914] block">
            Rate Your Experience
          </span>
          <h3 className="text-base font-black text-[#252525]">
            How was your meal from {order.cafes?.name || 'this restaurant'}?
          </h3>
          <p className="text-xs text-[#757575] mt-0.5">
            Order #{order.order_number} • Your feedback helps restaurant chefs and drivers maintain high quality.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Overall Star Rating */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#252525] block">
            Overall Rating <span className="text-[#E50914]">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 rounded-xl hover:scale-110 transition-transform cursor-pointer focus:outline-none"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                      : 'fill-[#F5F5F5] text-neutral-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-black text-[#252525] ml-2">
              {(hoverRating || rating)} of 5 Stars
            </span>
          </div>
        </div>

        {/* Detailed Criteria */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#FEE2E2]/60">
          {/* Food Quality */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#252525]">
              <Utensils className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Food Quality</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setFoodQualityRating(st)}
                  className="p-0.5 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${
                      st <= foodQualityRating ? 'fill-amber-400 text-amber-400' : 'fill-white text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Packaging Quality */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#252525]">
              <Package className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Packaging</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setPackagingRating(st)}
                  className="p-0.5 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${
                      st <= packagingRating ? 'fill-amber-400 text-amber-400' : 'fill-white text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Delivery / Pickup Experience */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#252525]">
              <Truck className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Delivery / Service</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setDeliveryRating(st)}
                  className="p-0.5 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${
                      st <= deliveryRating ? 'fill-amber-400 text-amber-400' : 'fill-white text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Review Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#252525] block">
            Review Title (Optional)
          </label>
          <input
            type="text"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="e.g. Delicious hot burger and fast delivery!"
            maxLength={100}
            className="w-full px-4 py-2.5 rounded-2xl border border-[#FEE2E2] focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] text-xs outline-none bg-[#FFF5F5]/30 transition-all"
          />
        </div>

        {/* Review Comment */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#252525] block">
            Detailed Feedback
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you enjoyed most about this order..."
            maxLength={600}
            className="w-full px-4 py-3 rounded-2xl border border-[#FEE2E2] focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] text-xs outline-none bg-[#FFF5F5]/30 transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-2xl bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-black shadow-md shadow-[#E50914]/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

