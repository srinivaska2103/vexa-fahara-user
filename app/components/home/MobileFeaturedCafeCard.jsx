'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MapPin, Heart, ArrowRight, Sparkles, Navigation, 
  ChevronLeft, ChevronRight, Check, ShieldCheck, Footprints 
} from 'lucide-react';
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
  const rating = rawRating ? parseFloat(rawRating).toFixed(1) : null;
  const reviewsCount = cafe?.total_reviews ?? cafe?.reviewsCount ?? cafe?.reviews_count ?? (Array.isArray(cafe?.reviews) ? cafe.reviews.length : 0);
  
  const city = cafe?.city || (cafe?.address ? cafe.address.split(',')[0].trim() : '');
  const distance = cafe?.distance ? `${cafe.distance} km` : null;
  
  const isWalkingCafe = Boolean(cafe?.is_walking_cafe || cafe?.service_type === 'WALKING_CAFE');
  const rawPrice = cafe?.price_per_hour ?? cafe?.pricePerHour ?? cafe?.base_price_per_hour ?? cafe?.price;
  const numPrice = Number(rawPrice);
  const hasPrice = !isWalkingCafe && !isNaN(numPrice) && numPrice > 0;

  // Active Deals/Offer detection
  const hasOffer = Boolean(
    cafe?.offer || cafe?.offers || cafe?.discount || 
    (Array.isArray(cafe?.discounts) && cafe.discounts.length > 0) ||
    (Array.isArray(cafe?.cafe_packages) && cafe.cafe_packages.some(p => Number(p.discount || p.discount_percentage) > 0))
  );

  // Amenities
  const rawAmenities = (
    (cafe?.amenities ? (typeof cafe.amenities === 'string' ? JSON.parse(cafe.amenities) : cafe.amenities) : []) || []
  );
  const amenityList = Array.isArray(rawAmenities) ? rawAmenities : Object.keys(rawAmenities).filter(k => rawAmenities[k]);

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

  const nextPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/customer/cafe/${cafeId}`)}
      className="shrink-0 w-[215px] xs:w-[225px] h-[305px] bg-white rounded-[22px] p-2.5 border border-[#E8DED5] shadow-[0_6px_20px_rgba(44,24,16,0.05)] hover:shadow-[0_14px_30px_rgba(111,78,55,0.12)] transition-all duration-300 cursor-pointer flex flex-col justify-between select-none relative group"
    >
      {/* 🖼️ Interactive Image Section with Photo Dots & Touch Swipe */}
      <div 
        className="relative w-full h-[142px] shrink-0 rounded-[18px] overflow-hidden bg-stone-100"
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
          if (diff > 30) {
            setActiveImgIndex((prev) => (prev + 1) % imageList.length);
          } else if (diff < -30) {
            setActiveImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
          }
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImgIndex}
            src={imageList[activeImgIndex]}
            alt={name}
            initial={{ opacity: 0.9, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.9 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80';
            }}
          />
        </AnimatePresence>

        {/* Gradient shadow for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges (Deal or Open Status) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {hasOffer && (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FF758C] to-[#FF7E5F] text-white text-[9px] font-black tracking-wider uppercase shadow-xs flex items-center gap-1 border border-white/40">
              <Sparkles size={9} />
              <span>Offer</span>
            </span>
          )}
        </div>

        {/* Interactive Wishlist Heart Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={handleFavoriteClick}
          aria-label={`Save ${name} to Wishlist`}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-stone-700 shadow-md active:scale-90 transition-all border border-stone-100 z-10"
        >
          <Heart size={15} className={cn(favorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700')} />
        </motion.button>

        {/* Photo Gallery Dots Indicator */}
        {imageList.length > 1 && (
          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1 z-10 pointer-events-none">
            {imageList.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  'h-1 rounded-full transition-all duration-200',
                  idx === activeImgIndex ? 'w-3.5 bg-amber-300 shadow-xs' : 'w-1 bg-white/60'
                )}
              />
            ))}
          </div>
        )}

        {/* Real Rating Badge */}
        {rating && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-black border border-white/20 z-10">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{rating}</span>
            {reviewsCount > 0 && <span className="text-stone-300 text-[9px]">({reviewsCount})</span>}
          </div>
        )}
      </div>

      {/* 📋 Info & Amenity Section with Fixed Proportions */}
      <div className="pt-2 flex flex-col flex-1 justify-between min-h-[135px]">
        <div className="space-y-0.5">
          {/* Cafe Name */}
          <h3 className="text-[13px] font-black text-[#2C1810] tracking-tight truncate group-hover:text-[#6F4E37] transition-colors leading-snug">
            {name}
          </h3>
          
          {/* Location / City */}
          <div className="flex items-center justify-between text-[10px] text-stone-500 h-3.5">
            <div className="flex items-center gap-1 truncate font-semibold">
              <MapPin size={10} className="text-[#6F4E37] shrink-0" />
              <span className="truncate">{city || 'Location available'}</span>
            </div>
            {distance && (
              <span className="text-[9px] font-bold text-stone-400 shrink-0">
                {distance}
              </span>
            )}
          </div>

          {/* Quick Amenity Tags (consistent height reservation) */}
          <div className="flex items-center gap-1 pt-1 flex-wrap h-5 overflow-hidden">
            {amenityList.length > 0 ? (
              <>
                {amenityList.slice(0, 2).map((am, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#FFF8F0] border border-[#E8DED5] text-[9px] font-bold text-[#6F4E37] capitalize truncate max-w-[85px]"
                  >
                    <Check size={7} className="text-emerald-600 stroke-[3]" />
                    <span className="truncate">{String(am).replace('_', ' ')}</span>
                  </span>
                ))}
                {amenityList.length > 2 && (
                  <span className="text-[9px] font-extrabold text-[#A67B5B]">
                    +{amenityList.length - 2}
                  </span>
                )}
              </>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[9px] font-bold text-stone-500 capitalize">
                <span>{cafe?.category || 'Cafe'}</span>
              </span>
            )}
          </div>
        </div>

        {/* 💳 Price & Interactive Action Button (Consistent Bottom Baseline) */}
        <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between shrink-0">
          <div>
            {isWalkingCafe ? (
              <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Walk In
              </span>
            ) : hasPrice ? (
              <div className="flex items-baseline gap-0.5">
                <span className="text-[9px] text-stone-400 font-bold">₹</span>
                <span className="text-sm font-black text-[#2C1810] tracking-tight">{numPrice}</span>
                <span className="text-[9px] text-stone-400 font-bold">/hr</span>
              </div>
            ) : (
              <span className="text-[9px] font-extrabold text-[#6F4E37]">Price on request</span>
            )}
          </div>

          <motion.div 
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-7 h-7 rounded-full bg-[#6F4E37] hover:bg-[#4A2C11] text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
            title="View Cafe Details"
          >
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
