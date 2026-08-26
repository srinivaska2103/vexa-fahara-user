'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useWishlistStore } from '@/stores/wishlist.store';

export default function FavoriteButton({ 
  id, 
  type = 'cafe', // 'cafe', 'event', 'wishlist'
  className, 
  size = 'default' // 'sm', 'default', 'lg'
}) {
  const { 
    favoriteCafes, 
    favoriteEvents, 
    toggleFavoriteCafe, 
    toggleFavoriteEvent,
    isFavoriteCafe,
    isFavoriteEvent
  } = useFavoritesStore();
  
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorite = type === 'cafe' 
    ? isFavoriteCafe(id) 
    : type === 'wishlist' 
      ? isInWishlist(id) 
      : isFavoriteEvent(id);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'cafe') toggleFavoriteCafe(id);
    else if (type === 'wishlist') toggleWishlist(id);
    else toggleFavoriteEvent(id);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={cn(
        "flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border shadow-sm transition-colors z-10",
        isFavorite ? "border-red-200 bg-red-50/90" : "border-[#E8DED5] hover:bg-white",
        sizeClasses[size],
        className
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={cn(
          "transition-colors",
          iconSizeClasses[size],
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-gray-700"
        )} 
      />
    </motion.button>
  );
}
