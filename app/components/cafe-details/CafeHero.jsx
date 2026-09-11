'use client';

import { Star, ShieldCheck, Heart, Share2, MapPin, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/favorites.store';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function CafeHero({ cafe }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const { 
    id, 
    name, 
    average_rating, 
    google_rating,
    google_reviews_link,
    total_reviews, 
    status,
    city,
    address,
  } = cafe || {};

  const cafeId = id || 1;
  const isFavoriteCafe = useFavoritesStore((state) => state.isFavoriteCafe);
  const toggleFavoriteCafe = useFavoritesStore((state) => state.toggleFavoriteCafe);
  const favorite = isFavoriteCafe ? isFavoriteCafe(cafeId) : false;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (cafeId) {
      toggleFavoriteCafe(cafeId);
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name || 'Fahara Cafe',
          text: `Check out ${name || 'this cafe'} on Fahara!`,
          url: window.location.href,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isVerified = status === 'ACTIVE' || status === 'APPROVED';
  const effectiveRating = (average_rating && parseFloat(average_rating) > 0) ? average_rating : google_rating;
  const rating = effectiveRating ? parseFloat(effectiveRating).toFixed(1) : '0.0';
  const reviewsCount = total_reviews || 0;
  const fullAddress = city ? `${address ? address + ', ' : ''}${city}` : (address || 'Location on map');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full pt-2 mb-6"
    >
      <div className="bg-white/90 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-3">
          
          {/* Cafe Name & Verified Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2C1810] tracking-tight leading-tight">
              {name || 'Cafe Details'}
            </h1>
            {isVerified && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black shadow-2xs">
                <ShieldCheck size={15} className="text-emerald-600" />
                <span>Verified Venue</span>
              </span>
            )}
          </div>
          
          {/* Sub-header Rating & Location */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-stone-600">
            {/* Rating Pill */}
            {google_reviews_link || cafe?.google_rating_link || cafe?.google_review_url ? (
              <a 
                href={google_reviews_link || cafe?.google_rating_link || cafe?.google_review_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Open original Google Reviews page"
                className="flex items-center bg-[#FFF8F0] hover:bg-[#F5EBE0] text-[#4A2C11] border border-[#DDB892]/60 hover:border-[#6F4E37] px-3 py-1.5 rounded-xl shadow-2xs font-extrabold transition-all cursor-pointer group/glink"
              >
                <Star size={15} className="fill-amber-500 text-amber-500 mr-1.5 group-hover/glink:scale-110 transition-transform" />
                <span>{rating}</span>
                <span className="text-stone-400 font-semibold ml-1.5">
                  ({reviewsCount} {t('reviews', 'reviews')})
                </span>
                <span className="ml-2 text-[10px] font-black text-[#6F4E37] bg-white/80 px-2 py-0.5 rounded-md border border-[#DDB892]/40 shadow-2xs">
                  Google Reviews ↗
                </span>
              </a>
            ) : (
              <div className="flex items-center bg-[#FFF8F0] text-[#4A2C11] border border-[#DDB892]/60 px-3 py-1.5 rounded-xl shadow-2xs font-extrabold">
                <Star size={15} className="fill-amber-500 text-amber-500 mr-1.5" />
                <span>{rating}</span>
                <span className="text-stone-400 font-semibold ml-1.5">
                  ({reviewsCount} {t('reviews', 'reviews')})
                </span>
              </div>
            )}
            
            <span className="text-stone-300 hidden sm:inline">•</span>
            
            {/* Location Badge */}
            <div className="flex items-center text-stone-700 hover:text-[#6F4E37] cursor-pointer transition-colors group">
              <MapPin size={16} className="mr-1.5 text-[#6F4E37] group-hover:scale-110 transition-transform shrink-0" />
              <span className="font-bold text-stone-600 group-hover:text-[#6F4E37] transition-colors">
                {fullAddress}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons: Share & Favorite */}
        <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
          {/* Share Button */}
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShareClick}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-stone-50 hover:bg-[#FFF8F0] border border-stone-200/80 hover:border-[#DDB892] rounded-2xl transition-all font-black text-xs text-[#2C1810] shadow-2xs"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} className="text-[#6F4E37]" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </motion.button>

          {/* Save / Favorite Button */}
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFavoriteClick}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-stone-50 hover:bg-[#FFF8F0] border border-stone-200/80 hover:border-[#DDB892] rounded-2xl transition-all font-black text-xs text-[#2C1810] shadow-2xs"
          >
            <Heart size={17} className={cn("transition-all duration-300", favorite ? "fill-rose-500 text-rose-500 scale-110" : "text-stone-500 hover:text-rose-500")} />
            <span>{favorite ? 'Saved' : 'Save'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
