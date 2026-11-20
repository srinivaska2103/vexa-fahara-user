'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronLeft, 
  Search, 
  ShoppingBag, 
  Star, 
  MapPin, 
  Clock, 
  Bike, 
  Utensils, 
  Tag, 
  Sparkles, 
  AlertCircle,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import RestaurantMenuSection from '@/app/components/cafe-details/RestaurantMenuSection';
import RestaurantReviewsSection from '@/app/components/food/RestaurantReviewsSection';
import { useCartStore } from '@/stores/cart.store';
import api from '@/lib/axios';

export default function RestaurantFoodOrderingPage() {
  const params = useParams();
  const router = useRouter();
  const cafeId = params?.cafeId;

  const { cart, itemCount, subtotal, finalPayableAmount } = useCartStore();

  // 1. Fetch Cafe Details
  const { data: cafeData, isLoading } = useQuery({
    queryKey: ['cafe-food-details', cafeId],
    queryFn: async () => {
      const res = await api.get(`/cafes/${cafeId}`);
      return res.data?.data || null;
    },
    enabled: !!cafeId
  });

  // 2. Fetch Live Ordering Availability & Business Hours
  const { data: availabilityData } = useQuery({
    queryKey: ['cafe-ordering-availability', cafeId],
    queryFn: async () => {
      const res = await api.get(`/public/cafes/${cafeId}/ordering-availability`).catch(() => ({ data: { data: null } }));
      return res.data?.data || null;
    },
    enabled: !!cafeId,
    refetchInterval: 30000 // Re-check every 30 seconds for live open/close boundaries
  });

  // 3. Fetch Real Customer Reviews for this Restaurant
  const { data: reviewsResponse, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['restaurant-reviews', cafeId],
    queryFn: async () => {
      const res = await api.get(`/reviews/cafe/${cafeId}`).catch(() => ({ data: { data: null } }));
      return res.data?.data || null;
    },
    enabled: !!cafeId
  });

  const cafe = cafeData;
  const settings = cafe?.cafe_fulfilment_settings || cafe?.fulfilment_settings;
  const takeawayOn = settings?.is_takeaway_enabled ?? true;
  const deliveryOn = settings?.is_delivery_enabled ?? false;

  const availability = availabilityData?.availability || cafe?.ordering_availability;
  const isOpen = availability ? availability.isOpen : true;
  const canPlaceOrder = availability ? availability.canPlaceOrder : true;
  const badgeLabel = availability ? availability.badge : 'Open for Orders';
  const todayHoursFormatted = availability?.todayHoursFormatted;
  const nextOpening = availability?.nextOpening;
  const pauseReason = availabilityData?.pauseReason || availability?.message;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5F5]/30">
        <CustomerNavbar />
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-4 border-[#E50914] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#757575]">Loading restaurant menu...</p>
        </div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-[#FFF5F5]/30">
        <CustomerNavbar />
        <div className="max-w-md mx-auto py-24 px-4 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-black text-[#252525]">Restaurant Not Found</h2>
          <Link href="/customer/food" className="text-xs font-bold text-[#E50914] underline">
            Return to Food Discovery
          </Link>
        </div>
      </div>
    );
  }

  const isCurrentCafeInCart = cart?.cafe_id === cafeId || cart?.cafe?.id === cafeId;

  return (
    <div className="min-h-screen bg-[#FFF5F5]/30 pb-44 sm:pb-28">
      <CustomerNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/customer/food"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#757575] hover:text-[#E50914] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Restaurants</span>
          </Link>

          <Link
            href={`/customer/cafe/${cafeId}`}
            className="text-xs font-bold text-[#757575] hover:text-[#252525] underline flex items-center gap-1"
          >
            <span>View Full Cafe Details &amp; Table Booking</span>
          </Link>
        </div>

        {/* ── RESTAURANT HEADER CARD ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Real-Time Ordering Availability Badge */}
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-2xs flex items-center gap-1.5 border ${
                  canPlaceOrder && isOpen
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : canPlaceOrder && !isOpen
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${canPlaceOrder && isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span>{badgeLabel}</span>
                </span>

                <span className="px-2.5 py-0.5 rounded-lg bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider">
                  Food Menu
                </span>
                {takeawayOn && (
                  <span className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-200">
                    Takeaway Available
                  </span>
                )}
                {deliveryOn && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    Home Delivery Available
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">
                {cafe.name}
              </h1>

              <p className="text-xs text-[#757575] flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
                <span>{cafe.address || cafe.city || 'Local Location'}</span>
              </p>
            </div>

            {reviewsResponse?.totalReviews > 0 ? (
              <div className="px-3.5 py-2 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] text-center self-start sm:self-auto">
                <div className="flex items-center gap-1 text-sm font-black text-[#252525]">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{Number(reviewsResponse.averageRating).toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-[#757575] font-bold">
                  {reviewsResponse.totalReviews} {reviewsResponse.totalReviews === 1 ? 'Customer Review' : 'Customer Reviews'}
                </span>
              </div>
            ) : cafe.google_rating ? (
              <div className="px-3.5 py-2 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] text-center self-start sm:self-auto">
                <div className="flex items-center gap-1 text-sm font-black text-[#252525]">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{Number(cafe.google_rating).toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-[#757575] font-bold">Google Rating</span>
              </div>
            ) : null}
          </div>

          {/* Business Hours & Operating Info Strip */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#FEE2E2] text-xs text-[#757575]">
            {/* Today's Business Hours */}
            <span className="flex items-center gap-1.5 font-bold text-[#252525]">
              <Clock className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Today: {todayHoursFormatted || 'Open during operating hours'}</span>
            </span>

            <span className="flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Prep Time: ~{settings?.estimated_prep_time || 20} mins</span>
            </span>

            {deliveryOn && (
              <span className="flex items-center gap-1 font-semibold">
                <Bike className="w-3.5 h-3.5 text-stone-400" />
                <span>Delivery: ₹{Number(settings?.delivery_charge || 30).toFixed(2)}</span>
                {settings?.free_delivery_threshold && (
                  <span className="text-emerald-600 font-bold ml-1">
                    (Free over ₹{Number(settings.free_delivery_threshold).toFixed(2)})
                  </span>
                )}
              </span>
            )}
          </div>

          {/* ── CLOSED / PAUSED CUSTOMER BANNER ── */}
          {!canPlaceOrder && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              availability?.reasonCode === 'TEMPORARILY_PAUSED'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <strong className="text-xs font-black uppercase tracking-wider block">
                  {availability?.reasonCode === 'TEMPORARILY_PAUSED'
                    ? 'Temporarily Not Accepting Orders'
                    : 'Currently Closed For Orders'}
                </strong>
                <p className="text-xs font-medium mt-0.5 leading-relaxed">
                  {availability?.message || 'This restaurant is not taking online orders right now.'}
                  {nextOpening && (
                    <span className="font-bold block mt-1">
                      Next ordering window opens: {nextOpening.label}.
                    </span>
                  )}
                </p>
                <span className="text-[10px] text-stone-500 font-bold block mt-1">
                  You can still browse dishes on the menu below.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── EMBEDDED REAL FOOD MENU WITH ORDERING AVAILABILITY ENFORCEMENT ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-4 sm:p-6 shadow-xs">
          <RestaurantMenuSection 
            cafeId={cafeId} 
            cafeName={cafe.name} 
            isOrderingAvailable={canPlaceOrder}
            availabilityReason={availability?.message}
          />
        </div>

        {/* ── REAL CUSTOMER REVIEWS & RATINGS SECTION ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 sm:p-7 shadow-xs">
          <RestaurantReviewsSection 
            reviewsData={reviewsResponse} 
            isLoading={isLoadingReviews} 
          />
        </div>

        {/* ── STICKY CART FOOTER BAR (Mobile floating pill bar & desktop sticky footer) ── */}
        {itemCount > 0 && isCurrentCafeInCart && (
          <div className="fixed bottom-22 md:bottom-0 left-0 right-0 z-40 px-2 sm:px-3 md:px-0 pointer-events-none">
            <div className="max-w-md md:max-w-5xl mx-auto pointer-events-auto bg-[#1A1A1A] text-white rounded-2xl md:rounded-none border border-stone-800 md:border-t md:border-b-0 md:border-x-0 md:border-[#FEE2E2] md:bg-white/95 md:text-[#252525] md:backdrop-blur-xl p-2.5 sm:p-4 shadow-[0_12px_36px_rgba(0,0,0,0.35)] md:shadow-[0_-10px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2 sm:gap-4 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Left Details: Item Count & Total Amount */}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#E50914] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                  {itemCount}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-stone-400 md:text-[#757575] block truncate">
                    {itemCount === 1 ? '1 Item' : `${itemCount} Items`}
                  </span>
                  <div className="text-xs sm:text-base font-black truncate text-white md:text-[#252525] flex items-center gap-0.5">
                    <span>₹{Number(finalPayableAmount).toFixed(2)}</span>
                    <span className="text-[9px] font-semibold text-stone-400 md:text-[#757575] ml-0.5 hidden sm:inline">
                      plus taxes
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Link
                  href="/customer/cart"
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white md:bg-stone-100 md:hover:bg-stone-200 md:text-[#252525] text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  View Cart
                </Link>

                {canPlaceOrder ? (
                  <Link
                    href="/customer/checkout"
                    className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-[11px] sm:text-xs font-black shadow-md shadow-red-950/40 md:shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>Checkout</span>
                    <span className="text-xs sm:text-sm font-black leading-none">→</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl bg-stone-700 md:bg-stone-300 text-stone-400 md:text-stone-600 text-[11px] sm:text-xs font-black cursor-not-allowed whitespace-nowrap"
                    title={availability?.message}
                  >
                    Closed
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
