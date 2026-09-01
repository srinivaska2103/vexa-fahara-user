'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, ArrowRight, Navigation, Sparkles, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { cn, checkIfCafeOpen } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useLanguage } from '@/context/LanguageContext';

export default function CafeCard({ cafe }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(checkIfCafeOpen(cafe));
  }, [cafe]);

  // Safe fallback mapping for backend structures
  const cafeId = cafe?.id || cafe?._id || cafe?.cafe_id || 1;
  const name = cafe?.name || cafe?.title || cafe?.cafe_name || 'Cafe';
  
  const imageUrl = cafe?.cover_image || cafe?.coverImage || cafe?.image || (Array.isArray(cafe?.images) ? cafe.images[0] : null) || cafe?.banner_image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80';
  
  const rawRating = cafe?.average_rating || cafe?.google_rating || cafe?.rating || cafe?.avg_rating || 4.8;
  const rating = (parseFloat(rawRating) || 4.8).toFixed(1);
  const reviewsCount = cafe?.total_reviews ?? cafe?.reviewsCount ?? cafe?.reviews_count ?? cafe?.review_count ?? (Array.isArray(cafe?.reviews) ? cafe.reviews.length : 0);
  
  const rawAddress = cafe?.address || cafe?.location || '';
  const location = cafe?.city || cafe?.area || (rawAddress ? rawAddress.split(',')[0] : 'Venue');
  const distance = cafe?.distance ? `${cafe.distance} km` : null;
  
  const rawPrice = cafe?.price_per_hour ?? cafe?.pricePerHour ?? cafe?.hourly_rate ?? cafe?.price_range ?? cafe?.base_price_per_hour ?? cafe?.price;
  const numPrice = Number(rawPrice);
  const hasValidPrice = rawPrice !== undefined && rawPrice !== null && rawPrice !== '' && !isNaN(numPrice) && numPrice > 0;

  // Favorites store integration
  const isFavoriteCafe = useFavoritesStore((state) => state.isFavoriteCafe);
  const toggleFavoriteCafe = useFavoritesStore((state) => state.toggleFavoriteCafe);
  const favorite = isFavoriteCafe ? isFavoriteCafe(cafeId) : false;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cafeId) {
      toggleFavoriteCafe(cafeId);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_35px_rgba(44,24,16,0.12)] transition-all duration-300 flex flex-col h-full group"
    >
      {/* 🖼️ Image Container with Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80';
          }}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
        
        {/* DISCOUNT BADGE FROM REAL CAFE DATA */}
        {Array.isArray(cafe?.discounts) && cafe.discounts.length > 0 && (
          <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/30 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200 animate-ping" />
            <span>
              {cafe.discounts[0].discountType === 'PERCENT' 
                ? `${cafe.discounts[0].amount}% OFF` 
                : `₹${cafe.discounts[0].amount} OFF`}
            </span>
          </div>
        )}

        {/* OPEN NOW / CLOSED Status Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-md shadow-md transition-all",
            isOpen 
              ? "bg-emerald-500/90 text-white ring-2 ring-emerald-400/40 shadow-emerald-900/20" 
              : "bg-stone-900/85 text-stone-200 ring-1 ring-stone-700/50"
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              isOpen ? "bg-white animate-pulse" : "bg-stone-400"
            )} />
            {isOpen ? t('openNow', 'OPEN NOW') : t('closed', 'CLOSED')}
          </span>
        </div>

        {/* Heart Favorite Button */}
        <motion.button 
          whileTap={{ scale: 0.85 }}
          onClick={handleFavoriteClick}
          aria-label="Add to Favorites"
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-500 hover:bg-white transition-all shadow-md active:scale-95 group/fav z-10"
        >
          <Heart 
            size={17} 
            className={cn(
              "transition-all duration-300", 
              favorite 
                ? "fill-rose-500 text-rose-500 scale-110" 
                : "group-hover/fav:text-rose-500 text-stone-600"
            )} 
          />
        </motion.button>
      </div>

      {/* 📄 Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Title & Rating */}
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight leading-snug line-clamp-2 group-hover:text-[#6F4E37] transition-colors duration-300">
              {name}
            </h3>
            <div className="flex items-center bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-lg text-xs font-bold flex-shrink-0 shadow-2xs">
              <Star size={13} className="fill-amber-500 text-amber-500 mr-1" />
              <span>{rating}</span>
              <span className="text-amber-700/60 ml-0.5 text-[10px]">({reviewsCount})</span>
            </div>
          </div>
          
          {/* Location & Distance */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5">
            <div className="flex items-center truncate max-w-[65%]">
              <MapPin size={14} className="mr-1 flex-shrink-0 text-[#6F4E37]" />
              <span className="truncate font-bold text-stone-600">{location}</span>
            </div>
            {distance && (
              <div className="flex items-center font-extrabold bg-stone-100/80 px-2 py-0.5 rounded-md text-stone-600 text-[10px] border border-stone-200/60 flex-shrink-0">
                <Navigation size={10} className="mr-1 text-stone-400" />
                {distance}
              </div>
            )}
          </div>

          {/* 3rd Party Event Management & Decoration Badge */}
          {cafe?.allow_third_party_decoration !== false && (
            <div className="mb-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50/90 border border-purple-200/80 text-purple-900 text-[10px] font-black shadow-2xs">
              <Sparkles size={12} className="text-purple-600 shrink-0 animate-pulse" />
              <span className="truncate">3rd Party Event Decor Allowed</span>
            </div>
          )}
        </div>

        {/* Price & Primary CTA Button (Sits cleanly INSIDE card borders) */}
        <div className="pt-3 border-t border-stone-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            {hasValidPrice ? (
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">₹{numPrice}</span>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">/ hr</span>
              </div>
            ) : (
              <div />
            )}
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">Instant</span>
          </div>

          <Link href={`/cafes/${cafeId}`}>
            <motion.button 
              whileTap={{ scale: 0.96 }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] hover:from-[#361f0a] hover:to-[#573d2a] text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg hover:shadow-[#4A2C11]/20 transition-all duration-300 active:scale-95 cursor-pointer group/btn"
            >
              <span>{t('viewDetails', 'View Details')}</span>
              <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>

      </div>
    </motion.div>
  );
}
