'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '@/stores/wishlist.store';
import { cafeDetailsService } from '@/services/cafeDetails.service';
import FavoriteCafeCard from '@/app/components/favorites/FavoriteCafeCard';
import EmptyFavorites from '@/app/components/favorites/EmptyFavorites';
import LoadingFavorites from '@/app/components/favorites/LoadingFavorites';
import FavoritesSearch from '@/app/components/favorites/FavoritesSearch';
import FavoritesFilter from '@/app/components/favorites/FavoritesFilter';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlistStore();
  
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  // Fetch full details for the wishlisted IDs
  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        if (wishlistItems.length > 0) {
          const itemPromises = wishlistItems.map(id => cafeDetailsService.getCafeById(id).catch(() => null));
          const results = await Promise.all(itemPromises);
          setItems(results.filter(Boolean));
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [wishlistItems]);

  // Filter and Sort logic
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];
    
    if (search) {
      result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.city?.toLowerCase().includes(search.toLowerCase()));
    }

    switch (sort) {
      case 'rating':
        result.sort((a, b) => (b.google_rating || 0) - (a.google_rating || 0));
        break;
      case 'price_low':
        result.sort((a, b) => (a.price_per_hour || 0) - (b.price_per_hour || 0));
        break;
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.reverse();
        break;
    }
    
    return result;
  }, [items, search, sort]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E8DED5] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2C1810] flex items-center gap-3">
                <Heart className="w-8 h-8 text-[#A67B5B] fill-amber-100" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">Dream venues you're keeping an eye on</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <FavoritesSearch search={search} setSearch={setSearch} />
              <FavoritesFilter sort={sort} setSort={setSort} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <LoadingFavorites />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filteredAndSortedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedItems.map(cafe => (
                    <FavoriteCafeCard 
                      key={cafe.id} 
                      cafe={cafe} 
                      onRemove={toggleWishlist}
                      type="wishlist"
                    />
                  ))}
                </div>
              ) : (
                <EmptyFavorites 
                  title={search ? "No items found matching your search" : "Your wishlist is empty"}
                  message={search ? "Try adjusting your search or filters." : "Save your dream venues here to easily find them when you're ready to book."}
                  actionText="Explore Venues"
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
