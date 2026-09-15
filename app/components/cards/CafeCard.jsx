'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MapPin, Star, ArrowRight, Navigation, Sparkles, 
  ChevronLeft, ChevronRight, Eye, Share2, Wifi, Wind, Car, 
  Trees, Music, Check, ShieldCheck, PartyPopper
} from 'lucide-react';
import Link from 'next/link';
import { cn, checkIfCafeOpen } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

export default function CafeCard({ cafe }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    setIsOpen(checkIfCafeOpen(cafe));
  }, [cafe]);

  // Safe fallback mapping for backend structures
  const cafeId = cafe?.id || cafe?._id || cafe?.cafe_id || 1;
  const name = cafe?.name || cafe?.title || cafe?.cafe_name || 'Cafe';
  
  // Extract gallery images for interactive hover slideshow
  const coverImage = cafe?.cover_image || cafe?.coverImage || cafe?.image || cafe?.banner_image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80';
  let imageList = [];
  if (Array.isArray(cafe?.gallery) && cafe.gallery.length > 0) {
    imageList = cafe.gallery.map(img => typeof img === 'string' ? img : img.url || coverImage);
  } else if (Array.isArray(cafe?.images) && cafe.images.length > 0) {
    imageList = cafe.images.map(img => typeof img === 'string' ? img : img.url || coverImage);
  }
  if (imageList.length === 0 || !imageList.includes(coverImage)) {
    imageList.unshift(coverImage);
  }

  const rawRating = cafe?.average_rating || cafe?.google_rating || cafe?.rating || cafe?.avg_rating || 4.8;
  const rating = (parseFloat(rawRating) || 4.8).toFixed(1);
  const reviewsCount = cafe?.total_reviews ?? cafe?.reviewsCount ?? cafe?.reviews_count ?? cafe?.review_count ?? (Array.isArray(cafe?.reviews) ? cafe.reviews.length : 0);
  
  const rawAddress = cafe?.address || cafe?.location || '';
  const location = cafe?.city || cafe?.area || (rawAddress ? rawAddress.split(',')[0] : 'Venue');
  const distance = cafe?.distance ? `${cafe.distance} km` : null;
  
  const categoryStr = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
  const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur');

  const rawPrice = cafe?.price_per_hour ?? cafe?.pricePerHour ?? cafe?.hourly_rate ?? cafe?.price_range ?? cafe?.base_price_per_hour ?? cafe?.price;
  const numPrice = Number(rawPrice);
  const hasValidPrice = !isRestaurant && rawPrice !== undefined && rawPrice !== null && rawPrice !== '' && !isNaN(numPrice) && numPrice > 0;

  // Extract amenities for visual chips
  const rawAmenities = (
    (cafe?.amenities ? (typeof cafe.amenities === 'string' ? JSON.parse(cafe.amenities) : cafe.amenities) : []) || []
  );
  const amenityList = Array.isArray(rawAmenities) ? rawAmenities : Object.keys(rawAmenities).filter(k => rawAmenities[k]);

  // Favorites store integration
  const isFavoriteCafe = useFavoritesStore((state) => state.isFavoriteCafe);
  const toggleFavoriteCafe = useFavoritesStore((state) => state.toggleFavoriteCafe);
  const favorite = isFavoriteCafe ? isFavoriteCafe(cafeId) : false;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cafeId) {
      toggleFavoriteCafe(cafeId);
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 800);
      toast.success(favorite ? 'Removed from Saved Favorites' : 'Added to Saved Favorites!');

      // Persist to backend and record analytics event
      try {
        const api = require('@/lib/axios').default;
        api.post('/favorites/toggle', { cafeId }).catch(() => {});
        api.post('/analytics/events', { cafe_id: cafeId, event_type: 'WISHLIST_ADD', source: 'website' }).catch(() => {});
      } catch (err) {}
    }
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/cafes/${cafeId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Venue link copied to clipboard!');
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.005 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(74,44,17,0.12)] hover:border-[#6F4E37]/40 transition-all duration-300 flex flex-col h-full group relative"
    >
        {/* 🖼️ Interactive Image Container with Slide Carousel & Swipe Support */}
        <div 
          className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 select-none"
          onTouchStart={(e) => {
            setTouchEnd(null);
            setTouchStart(e.targetTouches[0].clientX);
          }}
          onTouchMove={(e) => {
            setTouchEnd(e.targetTouches[0].clientX);
          }}
          onTouchEnd={() => {
            if (!touchStart || !touchEnd) return;
            const distance = touchStart - touchEnd;
            if (distance > 30) {
              setActiveImgIndex((prev) => (prev + 1) % imageList.length);
            } else if (distance < -30) {
              setActiveImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img 
              key={activeImgIndex}
              src={imageList[activeImgIndex]} 
              alt={name} 
              initial={{ opacity: 0.85, scale: 1.04 }}
              animate={{ opacity: 1, scale: isHovered ? 1.07 : 1 }}
              exit={{ opacity: 0.85 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full object-cover transition-transform duration-500 ease-out"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80';
              }}
            />
          </AnimatePresence>
          
          {/* Dynamic Multi-Layer Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25 opacity-70 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />
          
          {/* Interactive Image Carousel Navigation Buttons (Always visible on multi-image on mobile / on hover on desktop) */}
          {imageList.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between z-20 pointer-events-auto">
              <button
                type="button"
                onClick={prevImage}
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer border border-white/30"
                title="Previous photo"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer border border-white/30"
                title="Next photo"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* Carousel Pagination Dots */}
          {imageList.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-auto">
              {imageList.slice(0, 6).map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImgIndex(idx);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    idx === activeImgIndex 
                      ? "w-4 bg-white shadow-sm" 
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}

        {/* DISCOUNT BADGE */}
        {Array.isArray(cafe?.discounts) && cafe.discounts.length > 0 && Number(cafe.discounts[0]?.amount) > 0 ? (
          <div className="absolute top-2.5 left-2.5 z-20 bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white/40 backdrop-blur-md">
            <Sparkles size={10} className="text-amber-200 animate-pulse" />
            <span>
              {cafe.discounts[0].discountType === 'PERCENT' 
                ? `${cafe.discounts[0].amount}% OFF` 
                : `₹${cafe.discounts[0].amount} OFF`}
            </span>
          </div>
        ) : (
          <div className="absolute top-2.5 left-2.5 z-20 bg-black/40 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1">
            <ShieldCheck size={10} className="text-emerald-400" />
            <span>Verified</span>
          </div>
        )}

        {/* OPEN NOW / CLOSED Status Badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 z-20">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase flex items-center gap-1 backdrop-blur-md shadow-md transition-all border",
            isOpen 
              ? "bg-emerald-500/90 text-white border-emerald-300/40 shadow-emerald-900/20" 
              : "bg-stone-900/85 text-stone-200 border-stone-700/50"
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              isOpen ? "bg-white animate-pulse" : "bg-stone-400"
            )} />
            {isOpen ? t('openNow', 'OPEN NOW') : t('closed', 'CLOSED')}
          </span>
        </div>

        {/* Quick Action Top Right Icons: Share & Heart */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-20">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleShareClick}
            aria-label="Share Venue"
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-[#6F4E37] backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer"
            title="Share Venue"
          >
            <Share2 size={13} />
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.85 }}
            onClick={handleFavoriteClick}
            aria-label="Add to Favorites"
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-rose-500 backdrop-blur-md transition-all shadow-md active:scale-95 group/fav cursor-pointer relative"
          >
            <Heart 
              size={13} 
              className={cn(
                "transition-all duration-300", 
                favorite 
                  ? "fill-rose-500 text-rose-500 scale-110" 
                  : "group-hover/fav:text-rose-500 text-stone-700"
              )} 
            />

            {/* Heart Particle Animation Burst */}
            <AnimatePresence>
              {heartAnim && (
                <motion.span
                  initial={{ scale: 0, opacity: 1, y: 0 }}
                  animate={{ scale: 1.8, opacity: 0, y: -15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <Heart size={15} className="fill-rose-500 text-rose-500" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* 📄 Compact Interactive Content Area */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-white relative z-10">
        <div>
          {/* Title & Rating Badge */}
          <div className="flex justify-between items-start mb-1 gap-1.5">
            <h3 className="text-sm sm:text-base font-extrabold text-[#2C1810] tracking-tight leading-snug line-clamp-1 group-hover:text-[#6F4E37] transition-colors duration-300">
              {name}
            </h3>
            {cafe?.google_reviews_link || cafe?.google_rating_link || cafe?.google_review_url ? (
              <a 
                href={cafe.google_reviews_link || cafe.google_rating_link || cafe.google_review_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()}
                title="View original Google Reviews"
                className="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-lg text-[11px] font-black flex-shrink-0 shadow-2xs hover:border-amber-400 hover:scale-105 transition-all cursor-pointer"
              >
                <Star size={11} className="fill-amber-500 text-amber-500 mr-0.5" />
                <span>{rating}</span>
                <span className="text-amber-700/60 ml-0.5 text-[9px]">({reviewsCount})</span>
              </a>
            ) : (
              <div className="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-lg text-[11px] font-black flex-shrink-0 shadow-2xs">
                <Star size={11} className="fill-amber-500 text-amber-500 mr-0.5" />
                <span>{rating}</span>
                <span className="text-amber-700/60 ml-0.5 text-[9px]">({reviewsCount})</span>
              </div>
            )}
          </div>
          
          {/* Location & Distance */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
            <div className="flex items-center truncate max-w-[68%]">
              <MapPin size={12} className="mr-1 flex-shrink-0 text-[#6F4E37]" />
              <span className="truncate font-bold text-stone-600">{location}</span>
            </div>
            {distance && (
              <div className="flex items-center font-extrabold bg-stone-100/90 px-1.5 py-0.2 rounded text-stone-600 text-[9px] border border-stone-200/60 flex-shrink-0">
                <Navigation size={9} className="mr-0.5 text-stone-400" />
                {distance}
              </div>
            )}
          </div>

          {/* Interactive Feature Tags Bar */}
          <div className="flex items-center gap-1 flex-wrap mb-2">
            {!isRestaurant && cafe?.allow_third_party_decoration === true && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-200/80 text-purple-900 text-[9px] font-black shadow-2xs">
                <Sparkles size={10} className="text-purple-600 shrink-0" />
                <span className="truncate">3rd Party Decor</span>
              </div>
            )}

            {amenityList.length > 0 && amenityList.slice(0, 2).map((am, i) => (
              <div key={i} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-100 border border-stone-200/70 text-stone-600 text-[9px] font-bold capitalize">
                <Check size={9} className="text-emerald-600" />
                <span>{String(am).replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capability-Driven Responsive Action Footer */}
        <div className="pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
          {(
            cafe?.is_walking_cafe === true || 
            cafe?.is_walking_cafe === 'true' || 
            (cafe?.users && (cafe.users.user_type === 'WALKING_CAFE_OWNER' || cafe.users.role === 'WALKING_CAFE_OWNER' || cafe.users.roles?.name === 'WALKING_CAFE_OWNER')) ||
            (cafe?.owner && (cafe.owner.user_type === 'WALKING_CAFE_OWNER' || cafe.owner.role === 'WALKING_CAFE_OWNER' || cafe.owner.roles?.name === 'WALKING_CAFE_OWNER')) ||
            (cafe?.category || cafe?.service_type || '').toString().toLowerCase().includes('walking cafe')
          ) ? (
            <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-300/60 px-2 sm:px-2.5 py-1.5 rounded-xl shrink-0 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Walking Cafe
            </span>
          ) : hasValidPrice ? (
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-0.5">
                <span className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight">₹{numPrice}</span>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">/hr</span>
              </div>
              <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 block w-max">Instant Booking</span>
            </div>
          ) : (
            <span className="text-[10px] sm:text-[11px] font-extrabold text-[#6F4E37] bg-[#FFF8F0] border border-[#DDB892]/60 px-2 sm:px-2.5 py-1.5 rounded-xl shrink-0 truncate">
              Table Reservation
            </span>
          )}

          <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            {/* Primary CTA Button */}
            <Link href={`/cafes/${cafeId}`}>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="py-1.5 sm:py-2 px-3 sm:px-3.5 bg-gradient-to-r from-[#4A2C11] via-[#5A3825] to-[#6F4E37] hover:from-[#361f0a] hover:to-[#573d2a] text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg hover:shadow-[#4A2C11]/25 transition-all duration-300 cursor-pointer group/btn shrink-0"
              >
                <span className="whitespace-nowrap">View Details</span>
                <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform shrink-0" />
              </motion.button>
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

