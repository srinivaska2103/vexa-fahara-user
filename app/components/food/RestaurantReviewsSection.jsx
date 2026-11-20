'use client';

import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  ThumbsUp, 
  ShoppingBag, 
  Calendar, 
  Utensils, 
  Package, 
  Truck,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function RestaurantReviewsSection({ reviewsData, isLoading }) {
  const [filterRating, setFilterRating] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviewsData?.averageRating || 0;
  const totalReviews = reviewsData?.totalReviews || reviews.length || 0;

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    // Star rating filter
    if (filterRating !== 'ALL' && Number(r.rating) !== Number(filterRating)) {
      return false;
    }
    // Review type filter (FOOD_ORDER vs BOOKING)
    if (filterType === 'FOOD' && r.review_type !== 'FOOD_ORDER' && !r.order_id) {
      return false;
    }
    if (filterType === 'BOOKING' && (r.review_type === 'FOOD_ORDER' || r.order_id)) {
      return false;
    }
    return true;
  });

  // Calculate rating distributions
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Number(r.rating) === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="space-y-6">
      {/* ── SECTION HEADER & SUMMARY ── */}
      <div className="flex items-center justify-between pb-4 border-b border-[#FEE2E2]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E50914] text-white flex items-center justify-center shadow-xs">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#252525] tracking-tight">
              Customer Ratings &amp; Reviews
            </h2>
          </div>
          <p className="text-xs text-[#757575] font-medium pl-10">
            Real feedback from verified diners and food orders.
          </p>
        </div>

        {totalReviews > 0 && (
          <div className="flex items-center gap-2 bg-[#FFF5F5] border border-[#FEE2E2] px-3.5 py-1.5 rounded-2xl">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-black text-[#252525]">{Number(averageRating).toFixed(1)}</span>
            <span className="text-xs text-[#757575] font-bold">({totalReviews} reviews)</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-12 text-center space-y-2 animate-pulse">
          <div className="w-6 h-6 rounded-full border-2 border-[#E50914] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#757575] font-medium">Fetching real customer reviews...</p>
        </div>
      ) : totalReviews === 0 ? (
        <div className="py-12 px-4 text-center bg-[#FFF5F5]/60 rounded-3xl border border-[#FEE2E2] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#FEE2E2] text-amber-500 flex items-center justify-center mx-auto shadow-2xs">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-[#252525]">No reviews yet for this restaurant</h4>
            <p className="text-xs text-[#757575] max-w-sm mx-auto">
              Be the first customer to order dishes and leave a verified review!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ── RATINGS BREAKDOWN OVERVIEW CARD ── */}
          <div className="bg-[#FFF5F5]/50 border border-[#FEE2E2] rounded-3xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Score Big Card */}
            <div className="text-center md:border-r md:border-[#FEE2E2] md:pr-6 space-y-1.5">
              <span className="text-4xl sm:text-5xl font-black text-[#252525]">
                {Number(averageRating).toFixed(1)}
              </span>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-4 h-4 ${
                      s <= Math.round(averageRating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'fill-stone-200 text-stone-200'
                    }`} 
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-[#757575]">
                Based on {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Distribution Bars */}
            <div className="md:col-span-2 space-y-2">
              {distribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-12 shrink-0 font-bold text-[#252525]">
                    <span>{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono font-bold text-[11px] text-[#757575] shrink-0">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── FILTER CHIPS ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Rating Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['ALL', '5', '4', '3', '2', '1'].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFilterRating(star)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    filterRating === star
                      ? 'bg-[#E50914] text-white shadow-2xs'
                      : 'bg-[#FFF5F5] text-[#252525] border border-[#FEE2E2] hover:bg-white'
                  }`}
                >
                  {star === 'ALL' ? 'All Stars' : `${star} ★`}
                </button>
              ))}
            </div>

            {/* Type Filter (Food Order vs Table Booking) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                  filterType === 'ALL'
                    ? 'bg-[#252525] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All Types
              </button>
              <button
                type="button"
                onClick={() => setFilterType('FOOD')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'FOOD'
                    ? 'bg-[#252525] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Food Orders</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('BOOKING')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'BOOKING'
                    ? 'bg-[#252525] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>Table Bookings</span>
              </button>
            </div>
          </div>

          {/* ── REVIEWS GRID ── */}
          {filteredReviews.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#757575] font-bold">
              No reviews match the selected filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((r) => {
                const userName = r.users?.name || 'Verified Customer';
                const userInitial = userName.charAt(0).toUpperCase();
                const userAvatar = r.users?.profile_image;
                const isFoodOrder = r.review_type === 'FOOD_ORDER' || Boolean(r.order_id);
                const orderItems = r.food_orders?.order_items;
                const formattedDate = r.created_at
                  ? new Date(r.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Recently';

                return (
                  <div
                    key={r.id}
                    className="bg-white rounded-3xl border border-[#FEE2E2] p-5 shadow-xs hover:border-[#EF5350]/60 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-3">
                      {/* Top Row: User Avatar & Rating */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt={userName}
                              className="w-10 h-10 rounded-2xl object-cover border border-[#FEE2E2]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-[#FFF5F5] text-[#E50914] font-black flex items-center justify-center border border-[#FEE2E2] text-sm">
                              {userInitial}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-black text-[#252525]">{userName}</h4>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Customer" />
                            </div>
                            <span className="text-[10px] text-[#757575] font-bold">{formattedDate}</span>
                          </div>
                        </div>

                        {/* Star Badge */}
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-black text-amber-900">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{Number(r.rating).toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Review Title & Comment */}
                      <div className="space-y-1">
                        {r.review_title && (
                          <h5 className="text-xs font-black text-[#252525] leading-snug">
                            {r.review_title}
                          </h5>
                        )}
                        <p className="text-xs text-[#555555] leading-relaxed font-medium">
                          &ldquo;{r.review || 'Great food and timely service!'}&rdquo;
                        </p>
                      </div>

                      {/* Detailed Food/Packaging/Delivery Attributes if available */}
                      {(r.food_quality_rating || r.packaging_rating || r.delivery_rating) && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-[10px] font-bold text-[#757575]">
                          {r.food_quality_rating && (
                            <span className="inline-flex items-center gap-1 bg-[#FFF5F5] px-2 py-0.5 rounded-lg text-[#E50914] border border-[#FEE2E2]">
                              <Utensils className="w-3 h-3 shrink-0" /> Food: {r.food_quality_rating}★
                            </span>
                          )}
                          {r.packaging_rating && (
                            <span className="inline-flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded-lg text-stone-700 border border-stone-200">
                              <Package className="w-3 h-3 shrink-0" /> Pack: {r.packaging_rating}★
                            </span>
                          )}
                          {r.delivery_rating && (
                            <span className="inline-flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded-lg text-stone-700 border border-stone-200">
                              <Truck className="w-3 h-3 shrink-0" /> Delivery: {r.delivery_rating}★
                            </span>
                          )}
                        </div>
                      )}

                      {/* Ordered Items Snapshot if Food Order */}
                      {isFoodOrder && orderItems && orderItems.length > 0 && (
                        <div className="bg-[#FFF5F5]/60 rounded-xl p-2 border border-[#FEE2E2] text-[11px] text-[#252525] flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
                          <span className="truncate font-semibold">
                            Ordered: {orderItems.map((it) => `${it.quantity}x ${it.item_name_snapshot}`).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Tag */}
                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-1 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-md font-black uppercase tracking-wider text-[9px] ${
                        isFoodOrder 
                          ? 'bg-rose-50 text-[#E50914] border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isFoodOrder ? 'Verified Food Order' : 'Verified Dine-In'}
                      </span>
                      <span className="text-stone-400 font-bold text-[9px]">Grab2Go Verified</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
