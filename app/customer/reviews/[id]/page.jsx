'use client';

import React from 'react';
import { Share2, Edit2, Trash2 } from 'lucide-react';
import ReviewCard from '@/app/components/reviews/ReviewCard';
import { reviewService } from '@/services/review.service';

export default function ReviewDetailsPage({ params }) {
  const { id } = React.use(params);
  const [review, setReview] = React.useState(null);

  React.useEffect(() => {
    reviewService.getReviewById(id).then(res => setReview(res.data));
  }, [id]);

  if (!review) return <div className="p-8 text-center text-gray-500">Loading review...</div>;

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[#2C1810]">Review Details</h1>
        <ReviewCard review={review} />
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E8DED5] text-[#2C1810] hover:bg-gray-50 transition-colors">
            <Share2 size={18} /> Share Review
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#6F4E37] text-white rounded-lg hover:bg-[#A67B5B] transition-colors">
            <Edit2 size={18} /> Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors">
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
