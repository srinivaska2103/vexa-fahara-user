'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favorites.store';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function MobileFeaturedCafeCard({ cafe }) {
  const router = useRouter();
  const cafeId = cafe?.id || cafe?._id || cafe?.cafe_id;
  const name = cafe?.name || cafe?.title || 'Cafe';
  
  // Real backend images extraction & carousel support
  const coverImage = cafe?.cover_image || cafe?.coverImage || cafe?.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80';
  let imageList = [];
  if (Array.isArray(cafe?.gallery) && cafe.gallery.length > 0) {
    imageList = cafe.gallery.map(img => typeof img === 'string' ? img : img.url || coverImage);
  } else if (Array.isArray(cafe?.images) && cafe.images.length > 0) {
    imageList = cafe.images.map(img => typeof img === 'string' ? img : img.url || coverImage);
  }
  if (imageList.length === 0 || !imageList.includes(coverImage)) {
    imageList.unshift(coverImage);
  }

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const rawRating = cafe?.average_rating ?? cafe?.google_rating ?? cafe?.rating;
  const rating = rawRating ? parseFloat(rawRating).toFixed(1) : '5.0';
  const reviewsCount = cafe?.total_reviews ?? cafe?.reviewsCount ?? cafe?.reviews_count ?? (Array.isArray(cafe?.reviews) ? cafe.reviews.length : 0);
  
  // Distance
  const distance = cafe?.distance ? `${cafe.distance} km` : (cafe?.distance_km ? `${cafe.distance_km} km` : null);

  // Price formatting: "₹499 for 2"
  const rawPrice = cafe?.price_per_hour ?? cafe?.pricePerHour ?? cafe?.base_price_per_hour ?? cafe?.price ?? 
    (Array.isArray(cafe?.cafe_packages) && cafe.cafe_packages.length > 0 ? (cafe.cafe_packages[0].price ?? cafe.cafe_packages[0].base_price) : null);
  const numPrice = Number(rawPrice);
  const formattedPrice = (!isNaN(numPrice) && numPrice > 0) ? `₹${numPrice} for 2` : '₹499 for 2';

  // Wishlist
  const isFavoriteCafe = useFavoritesStore((state) => state.isFavoriteCafe);
  const toggleFavoriteCafe = useFavoritesStore((state) => state.toggleFavoriteCafe);
  const favorite = isFavoriteCafe ? isFavoriteCafe(cafeId) : false;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cafeId) {
      toggleFavoriteCafe(cafeId);
      toast.success(favorite ? 'Removed from Wishlist' : 'Saved to Wishlist!');
      try {
        const api = require('@/lib/axios').default;
        api.post('/favorites/toggle', { cafeId }).catch(() => {});
      } catch (e) {}
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/customer/cafe/${cafeId}`)}
      className="shrink-0 w-[158px] xs:w-[168px] sm:w-[178px] bg-white rounded-[18px] p-2 border border-[#FEE2E2] shadow-[0_4px_16px_rgba(44,24,16,0.06)] hover:shadow-[0_8px_24px_rgba(111,78,55,0.12)] transition-all duration-300 cursor-pointer flex flex-col select-none relative group"
    >
      {/* 🖼️ Landscape Image (approx 16:9) with Overlays */}
      <div 
        className="relative w-full aspect-[16/10.5] shrink-0 rounded-[14px] overflow-hidden bg-stone-100"
        onTouchStart={(e) => {
          setTouchEnd(null);
          setTouchStart(e.targetTouches[0].clientX);
        }}
        onTouchMove={(e) => {
          setTouchEnd(e.targetTouches[0].clientX);
        }}
        onTouchEnd={() => {
          if (!touchStart || !touchEnd) return;
          const diff = touchStart - touchEnd;
          if (diff > 25) {
            setActiveImgIndex((prev) => (prev + 1) % imageList.length);
          } else if (diff < -25) {
            setActiveImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
          }
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImgIndex}
            src={imageList[activeImgIndex]}
            alt={name}
            initial={{ opacity: 0.92 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.92 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80';
            }}
          />
        </AnimatePresence>

        {/* Subtle dark gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none" />

        {/* Top-Left Cafe Brand Pill Overlay */}
        <div className="absolute top-1.5 left-1.5 z-10 max-w-[65%]">
          <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#252525] text-[8.5px] font-black tracking-tight truncate block shadow-2xs border border-white/60">
            {name}
          </span>
        </div>

        {/* Top-Right Heart / Favourite Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={handleFavoriteClick}
          aria-label={`Save ${name} to Wishlist`}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 hover:bg-white backdrop-blur-xs flex items-center justify-center text-stone-700 shadow-xs active:scale-90 transition-all border border-white/60 z-10"
        >
          <Heart size={12} className={cn(favorite ? 'fill-red-500 text-red-500' : 'text-stone-600')} />
        </motion.button>

        {/* Multi-photo indicator dots */}
        {imageList.length > 1 && (
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center gap-0.5 z-10 pointer-events-none">
            {imageList.slice(0, 4).map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  'h-0.5 rounded-full transition-all duration-200',
                  idx === activeImgIndex ? 'w-2.5 bg-white shadow-xs' : 'w-1 bg-white/50'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* 📋 Cafe Information - Compact layout matching Reference 1 */}
      <div className="pt-2 px-0.5 flex flex-col gap-0.5">
        {/* Bold Uppercase Cafe Name */}
        <h3 className="text-[11.5px] font-black text-[#252525] uppercase tracking-wide truncate group-hover:text-[#E50914] transition-colors leading-tight">
          {name}
        </h3>

        {/* Star Rating & Review Count */}
        <div className="flex items-center gap-1 mt-0.5">
          <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
          <span className="text-[11px] font-black text-[#252525]">{rating}</span>
          <span className="text-[10px] font-medium text-stone-400">
            ({reviewsCount > 0 ? reviewsCount : 1})
          </span>
        </div>

        {/* Price & Distance Row */}
        <div className="flex items-center justify-between text-[11px] pt-0.5 font-bold">
          <span className="text-[#6D5A50] font-bold tracking-tight">
            {formattedPrice}
          </span>
          {distance && (
            <span className="text-[9.5px] font-medium text-stone-400 shrink-0">
              {distance}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

