'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import ReviewCard from '@/app/components/reviews/ReviewCard';
import WriteReviewCard from '@/app/components/reviews/WriteReviewCard';
import ReviewStats from '@/app/components/reviews/ReviewStats';
import EmptyReviews from '@/app/components/reviews/EmptyReviews';
import LoadingReviews from '@/app/components/reviews/LoadingReviews';
import ReviewFilters from '@/app/components/reviews/ReviewFilters';
import ReviewSearch from '@/app/components/reviews/ReviewSearch';
import ReviewSort from '@/app/components/reviews/ReviewSort';
import DeleteReviewModal from '@/app/components/reviews/DeleteReviewModal';
import { MessageSquareText } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export default function MyReviewsPage() {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');

  // Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch bookings to find things we can review
        const bookingsRes = await api.get('/bookings/my-bookings');
        const pastBookings = bookingsRes.data.data.filter(b => b.booking_status === 'COMPLETED');
        
        // Normally, we'd fetch user's reviews from a `GET /reviews/me` endpoint.
        // Since that doesn't exist, we will fetch reviews for the cafes they've booked,
        // and filter by the current user's ID to find their own reviews.
        const uniqueCafeIds = [...new Set(pastBookings.map(b => b.cafe_id).filter(Boolean))];
        let myReviews = [];
        
        for (const cid of uniqueCafeIds) {
          try {
            const revRes = await api.get(`/reviews/cafe/${cid}`);
            const userReviews = (revRes.data.data.reviews || []).filter(r => r.user_id === user?.id);
            myReviews = [...myReviews, ...userReviews];
          } catch (e) {
            console.error(e);
          }
        }
        
        // Find bookings that haven't been reviewed yet (rough estimate based on cafe_id)
        const reviewedCafeIds = myReviews.map(r => r.cafe_id);
        const toReview = pastBookings.filter(b => !reviewedCafeIds.includes(b.cafe_id));

        setReviews(myReviews);
        setCompletedBookings(toReview);
      } catch (error) {
        console.error("Failed to fetch reviews data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  // Handle derived/sorted data
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];
    
    // Search
    if (search) {
      result = result.filter(r => 
        r.title?.toLowerCase().includes(search.toLowerCase()) || 
        r.review?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter
    if (filter === 'Cafes') result = result.filter(r => r.cafe_id);
    if (filter === 'Event Companies') result = result.filter(r => r.event_service_id);
    if (filter === '5 Stars') result = result.filter(r => r.rating === 5);
    if (filter === 'With Images') result = result.filter(r => r.images && r.images.length > 0);

    // Sort
    switch (sort) {
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }
    
    return result;
  }, [reviews, search, filter, sort]);

  const handleDeleteSuccess = () => {
    setReviews(prev => prev.filter(r => r.id !== reviewToDelete));
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E8DED5] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2C1810] flex items-center gap-3">
                <MessageSquareText className="w-8 h-8 text-[#A67B5B]" />
                My Reviews
              </h1>
              <p className="text-gray-600 mt-1">Manage your ratings and reviews</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <ReviewSearch search={search} setSearch={setSearch} />
              <ReviewSort sort={sort} setSort={setSort} />
            </div>
          </div>
          
          <div className="mt-6">
            <ReviewFilters filter={filter} setFilter={setFilter} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        
        {/* Write a Review Prompts */}
        {!isLoading && completedBookings.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#2C1810] mb-4">Pending Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedBookings.slice(0, 2).map(booking => (
                <WriteReviewCard key={booking.id} booking={booking} />
              ))}
            </div>
          </section>
        )}

        {/* Stats */}
        {!isLoading && reviews.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#2C1810] mb-4">Your Impact</h2>
            <ReviewStats reviews={reviews} />
          </section>
        )}

        {/* Reviews List */}
        <section>
          <h2 className="text-xl font-bold text-[#2C1810] mb-4">Past Reviews</h2>
          {isLoading ? (
            <LoadingReviews />
          ) : (
            <AnimatePresence mode="wait">
              {filteredAndSortedReviews.length > 0 ? (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredAndSortedReviews.map(review => (
                    <ReviewCard 
                      key={review.id} 
                      review={review} 
                      isOwn={true}
                      onEdit={() => window.location.href = `/customer/reviews/${review.id}/edit`}
                      onDelete={(id) => {
                        setReviewToDelete(id);
                        setDeleteModalOpen(true);
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyReviews 
                  title={search || filter !== 'All' ? "No reviews match your criteria" : "You haven't written any reviews yet"}
                />
              )}
            </AnimatePresence>
          )}
        </section>

      </div>

      <DeleteReviewModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        reviewId={reviewToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
