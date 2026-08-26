'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, ArrowRight } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

export default function FavoriteCafeCard({ cafe, onRemove, type = 'favorite' }) {
  const coverImage = cafe.cover_image || cafe.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -10 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
        <img
          src={coverImage}
          alt={cafe.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Heart Toggle Button Top Right */}
        <div 
          className="absolute top-3.5 right-3.5 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onRemove) onRemove(cafe.id || cafe._id);
          }}
        >
          <FavoriteButton 
            id={cafe.id || cafe._id} 
            type={type === 'wishlist' ? 'wishlist' : 'cafe'} 
            size="sm" 
          />
        </div>

        {/* Rating Badge Top Left */}
        <div className="absolute top-3.5 left-3.5 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black text-stone-900 shadow-sm flex items-center gap-1 border border-white/50">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{cafe.google_rating || '4.8'}</span>
        </div>

        {/* Price Tag Bottom Left */}
        {cafe.price_per_hour && (
          <div className="absolute bottom-3 left-3 bg-[#2C1810]/90 text-white backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black shadow-md border border-white/20">
            ₹{cafe.price_per_hour}/hr
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight line-clamp-1 group-hover:text-[#6F4E37] transition-colors">
              {cafe.name}
            </h3>
            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/80 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> New
            </span>
          </div>

          <div className="space-y-1.5 mt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" />
              <span>{cafe.address || cafe.city || 'Indiranagar, Bengaluru'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
              <Users className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" />
              <span>Up to {cafe.maximum_persons || 10} guests</span>
            </div>
          </div>
        </div>

        {/* Actions Row (Matching Screenshot 1) */}
        <div className="flex items-center gap-2 pt-3 border-t border-stone-100 mt-auto">
          <motion.button 
            whileTap={{ scale: 0.94 }}
            onClick={() => onRemove(cafe.id || cafe._id)}
            className="px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all border border-rose-200/60 cursor-pointer"
          >
            Remove
          </motion.button>

          <Link 
            href={`/cafes/${cafe.id || cafe._id}`}
            className="flex-1"
          >
            <motion.div
              whileTap={{ scale: 0.96 }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
