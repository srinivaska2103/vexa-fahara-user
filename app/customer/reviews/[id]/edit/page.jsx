import React from 'react';
import WriteReviewCard from '@/app/components/reviews/WriteReviewCard';

export default function EditReviewPage({ params }) {
  return (
    <div className="min-h-screen bg-[#FFF8F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2C1810]">Edit Review</h1>
        </div>
        
        {/* Reuse the WriteReview form component, normally passing initialData */}
        <WriteReviewCard editMode={true} reviewId={params.id} />
      </div>
    </div>
  );
}
