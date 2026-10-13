'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Heart, Images } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileFavoriteCard({
  item,
  isEvent = false,
  onRemove,
}) {
  const itemId = item.id || item._id;
  const name = isEvent ? (item.profiles?.name || item.service_name || 'Event Partner') : item.name;
  const location = isEvent 
    ? (item.service_area || item.city || 'Bengaluru')
    : (item.address || item.city || 'Indiranagar, Bengaluru');
  
  const coverImage = isEvent
    ? (item.gallery?.[0] || item.portfolio?.[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80')
    : (item.cover_image || item.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80');

  // Real review and gallery count if available
  const rawReviews = item.reviews || [];
  const reviewCount = Array.isArray(rawReviews) ? rawReviews.length : (item.total_reviews || null);
  const rating = isEvent ? (item.profiles?.google_rating || '4.8') : (item.google_rating || item.average_rating || '4.8');

  const galleryList = Array.isArray(item.gallery) ? item.gallery : (Array.isArray(item.images) ? item.images : []);
  const galleryCount = galleryList.length > 1 ? galleryList.length : null;

  // Extract real category and package tags
  const tags = [];
  if (isEvent) {
    if (item.category) tags.push(item.category);
    if (item.service_type && item.service_type !== item.category) tags.push(item.service_type);
  } else {
    // Check cafe category / tags
    const category = item.category || 'Cafe';
    tags.push(category);

    if (Array.isArray(item.cafe_packages) && item.cafe_packages.length > 0) {
      item.cafe_packages.slice(0, 2).forEach(p => {
        const pName = p.package_name || p.event_type;
        if (pName && !tags.includes(pName)) {
          // Format tag nicely (e.g. Birthday, Anniversary)
          const cleanTag = pName.replace(/\s+(Package|Basic|Gold|Diamond)/gi, '');
          if (cleanTag && !tags.includes(cleanTag)) tags.push(cleanTag);
        }
      });
    }

    if (tags.length < 3 && item.amenities) {
      const am = Array.isArray(item.amenities) ? item.amenities : [];
      if (am.includes('wifi') && !tags.includes('Wi-Fi')) tags.push('Wi-Fi');
      if (am.includes('outdoor') && !tags.includes('Outdoor')) tags.push('Outdoor');
    }
  }

  const detailUrl = isEvent 
    ? `/events/${itemId}` 
    : `/customer/cafe/${itemId}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="bg-white rounded-[26px] p-3 border border-[#E8DED5]/80 shadow-[0_6px_24px_rgba(44,24,16,0.05)] relative flex items-center gap-3.5 select-none"
    >
      {/* ── LEFT: Prominent Rounded Image Area ── */}
      <div className="relative w-36 h-36 xs:w-40 xs:h-40 rounded-[22px] overflow-hidden bg-stone-100 flex-shrink-0">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Optional Gallery Count (e.g., 1/8) */}
        {galleryCount && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1">
            <Images size={11} />
            <span>1/{galleryCount}</span>
          </div>
        )}
      </div>

      {/* ── RIGHT: Venue Information & Action ── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        
        {/* Top: Venue Name + Heart Button */}
        <div>
          <div className="flex items-start justify-between gap-2 pr-1">
            <h3 className="text-sm xs:text-base font-black text-[#2C1810] tracking-tight leading-tight line-clamp-1">
              {name}
            </h3>

            {/* Heart Toggle Button (Filled Red in Soft Circle) */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onRemove) onRemove(itemId);
              }}
              className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-2xs hover:bg-rose-100 active:scale-90 transition-all -mt-0.5"
              title="Remove from favourites"
              aria-label="Remove from favourites"
            >
              <Heart size={15} className="fill-rose-500 text-rose-500" />
            </motion.button>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500 mt-1 line-clamp-1">
            <MapPin size={12} className="text-stone-400 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 text-[11px] font-black text-[#2C1810] mt-1">
            <Star size={13} className="fill-amber-400 text-amber-400 flex-shrink-0" />
            <span>{rating}</span>
            {reviewCount !== null && (
              <span className="text-stone-400 font-medium">({reviewCount} reviews)</span>
            )}
          </div>
        </div>

        {/* Middle: Tags (Cafe, Birthday, Corporate) */}
        <div className="flex items-center gap-1.5 flex-wrap my-1.5 overflow-hidden max-h-6">
          {tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-bold text-stone-600 bg-stone-100/90 border border-stone-200/60 px-2 py-0.5 rounded-full truncate max-w-[85px]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom: View Details Button */}
        <Link href={detailUrl} className="block mt-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            className="w-full py-2 px-3 rounded-full bg-[#6F4E37] hover:bg-[#5A3E2B] text-white text-[11px] xs:text-xs font-bold tracking-tight flex items-center justify-center gap-1.5 shadow-sm active:shadow-none transition-all cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight size={13} />
          </motion.button>
        </Link>

      </div>
    </motion.div>
  );
}
