'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReviewForm from '@/app/components/reviews/ReviewForm';
import api from '@/lib/axios';

function CreateReviewContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      api.get(`/bookings/customer`)
        .then(res => {
          const b = res.data.data.find(x => x.id === bookingId);
          setBooking(b);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E8DED5] border-t-[#6F4E37]" />
      </div>
    );
  }

  const type = booking?.event_service_id ? 'event' : 'cafe';
  const targetId = booking?.event_service_id || booking?.cafe_id;

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2C1810]">Write a Review</h1>
          {booking && (
            <p className="text-gray-600 mt-2">
              Share your experience at <span className="font-semibold">{booking.cafes?.name || booking.event_service_id}</span>
            </p>
          )}
        </div>

        <ReviewForm 
          cafeId={type === 'cafe' ? targetId : null}
          eventServiceId={type === 'event' ? targetId : null}
          type={type}
        />

      </div>
    </div>
  );
}

export default function CreateReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFF8F0] py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E8DED5] border-t-[#6F4E37]" />
      </div>
    }>
      <CreateReviewContent />
    </Suspense>
  );
}
