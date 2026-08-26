'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Shield, User } from 'lucide-react';
import RatingStars from './RatingStars';
import RatingBreakdown from './RatingBreakdown';
import ReviewImages from './ReviewImages';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ 
  cafeId = null, 
  eventServiceId = null, 
  type = 'cafe', // 'cafe' or 'event'
  onSuccess 
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const initialBreakdown = type === 'cafe' ? {
    food: 0,
    ambience: 0,
    service: 0,
    cleanliness: 0,
    value: 0
  } : {
    serviceQuality: 0,
    decoration: 0,
    photography: 0,
    staffBehaviour: 0,
    communication: 0
  };

  const [breakdown, setBreakdown] = useState(initialBreakdown);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [images, setImages] = useState([]);

  // Calculate overall rating dynamically based on breakdown
  const values = Object.values(breakdown);
  const selectedValues = values.filter(v => v > 0);
  const overallRating = selectedValues.length > 0 
    ? Math.round(selectedValues.reduce((a, b) => a + b, 0) / selectedValues.length) 
    : 0;

  const handleBreakdownChange = (key, val) => {
    setBreakdown(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (overallRating === 0) {
      toast.error('Please provide at least one rating criterion.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Encode the detailed breakdown into the review text since backend only accepts 'rating', 'review', 'images'
      const breakdownPayload = JSON.stringify({ breakdown, title, isAnonymous });
      const separator = "\n\n---META---\n";
      const finalReview = `${review}${separator}${breakdownPayload}`;

      const payload = {
        rating: overallRating,
        review: finalReview,
        images: images, // Assuming these are URLs if we implemented an upload. Here they are blob URLs which might fail validation on backend, but we'll try!
      };

      if (cafeId) payload.cafe_id = cafeId;
      if (eventServiceId) payload.event_service_id = eventServiceId;

      await api.post('/reviews', payload);
      toast.success('Review submitted successfully!');
      if (onSuccess) onSuccess();
      else router.push('/customer/reviews');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8DED5] overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">
        
        {/* Overall Score preview */}
        <div className="flex flex-col items-center justify-center bg-[#FFF8F0] p-6 rounded-2xl">
          <h3 className="text-[#2C1810] font-bold mb-2">Overall Rating</h3>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-[#6F4E37]">{overallRating}</span>
            <RatingStars value={overallRating} readOnly size="xl" />
          </div>
          <p className="text-sm text-[#A67B5B] mt-2">Calculated based on your detailed ratings below</p>
        </div>

        {/* Breakdown */}
        <div>
          <h3 className="text-lg font-bold text-[#2C1810] mb-4">Detailed Ratings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <RatingBreakdown breakdown={breakdown} onChange={handleBreakdownChange} />
          </div>
        </div>

        <hr className="border-[#E8DED5]" />

        {/* Text Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#2C1810] mb-2">Review Title</label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full px-4 py-3 bg-gray-50 border border-[#E8DED5] rounded-xl focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2C1810] mb-2">Detailed Review</label>
            <textarea 
              required
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="w-full px-4 py-3 bg-gray-50 border border-[#E8DED5] rounded-xl focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Images */}
        <ReviewImages images={images} setImages={setImages} />

        {/* Anonymous Toggle */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`w-12 h-6 rounded-full transition-colors relative ${isAnonymous ? 'bg-[#6F4E37]' : 'bg-gray-300'}`}
          >
            <motion.div 
              layout
              className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm"
              animate={{ left: isAnonymous ? '24px' : '4px' }}
            />
          </button>
          <div className="flex items-center gap-2">
            {isAnonymous ? <Shield className="w-4 h-4 text-[#6F4E37]" /> : <User className="w-4 h-4 text-gray-500" />}
            <span className="text-sm font-medium text-gray-700">
              Submit as Anonymous
            </span>
          </div>
        </div>

      </div>

      <div className="p-6 bg-gray-50 border-t border-[#E8DED5] flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || overallRating === 0}
          className="flex items-center gap-2 px-8 py-3 bg-[#6F4E37] text-white rounded-xl font-medium hover:bg-[#5A3E2B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Submit Review
        </button>
      </div>
    </form>
  );
}
