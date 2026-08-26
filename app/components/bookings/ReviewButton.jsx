import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewButton({ onClick, hasReviewed = false }) {
  if (hasReviewed) {
    return (
      <button 
        disabled
        className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <Star className="w-5 h-5 fill-current" />
        Reviewed
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className="w-full sm:w-auto px-6 py-3 bg-amber-500 text-white hover:bg-amber-600 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
    >
      <Star className="w-5 h-5" />
      Leave a Review
    </button>
  );
}
