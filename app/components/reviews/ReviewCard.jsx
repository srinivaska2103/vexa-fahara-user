'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { MoreVertical, Flag, Edit, Trash2, ShieldCheck, ThumbsUp } from 'lucide-react';
import RatingStars from './RatingStars';
import ReviewGallery from './ReviewGallery';
import { useReviewsStore } from '@/stores/reviews.store';

export default function ReviewCard({ 
  review, 
  isOwn = false, 
  onEdit, 
  onDelete, 
  onReport 
}) {
  const { editedReviews, isReported } = useReviewsStore();
  
  // Merge any local edits
  const localEdit = editedReviews[review.id];
  const displayData = localEdit ? { ...review, ...localEdit } : review;

  const reported = isReported(review.id);
  
  if (reported) {
    return (
      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center text-gray-500 text-sm">
        You have reported this review. It is hidden while under review by our moderators.
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl border border-[#E8DED5] shadow-sm relative group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FDECE0] rounded-full flex items-center justify-center text-[#6F4E37] font-bold text-lg">
            {displayData.users?.name?.[0] || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#2C1810]">
                {displayData.users?.name || 'Anonymous'}
              </h4>
              <ShieldCheck className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-500">
              {format(new Date(displayData.created_at || new Date()), 'MMMM d, yyyy')}
              {localEdit && ' (Edited)'}
            </p>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative">
          {isOwn ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit(review)}
                className="p-2 text-gray-400 hover:text-[#6F4E37] hover:bg-[#FFF8F0] rounded-full transition-colors"
                title="Edit Review"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(review.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete Review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onReport(review.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              title="Report Review"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <RatingStars value={displayData.rating} readOnly size="sm" />
      </div>

      {displayData.title && (
        <h5 className="font-bold text-[#2C1810] mb-2">{displayData.title}</h5>
      )}
      
      {displayData.review && (
        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
          {displayData.review}
        </p>
      )}

      {/* Try to parse breakdown if we injected it into the review text or stored locally */}
      {displayData.breakdown && Object.keys(displayData.breakdown).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {Object.entries(displayData.breakdown).map(([key, val]) => (
            <div key={key} className="text-xs flex items-center gap-1.5 bg-[#FFF8F0] px-2 py-1 rounded-md text-[#6F4E37]">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span className="font-bold">{val}★</span>
            </div>
          ))}
        </div>
      )}

      {displayData.images && displayData.images.length > 0 && (
        <ReviewGallery images={displayData.images} />
      )}

      <div className="mt-6 flex items-center gap-2 pt-4 border-t border-[#E8DED5]">
        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#6F4E37] transition-colors">
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful (0)
        </button>
      </div>
    </motion.div>
  );
}
