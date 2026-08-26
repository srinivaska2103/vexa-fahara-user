'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, Sparkles, Compass, Coffee, 
  MapPin, Star, ArrowRight, MousePointerClick, Flame
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { useFavoritesStore } from '@/stores/favorites.store';

export default function EmptyFavorites({ 
  title = "No Favorite Cafes Saved", 
  message = "Click the heart icon on any cafe to save it to your favorites.",
  actionText = "Discover Cafes",
  actionLink = "/customer/cafe"
}) {
  const [demoHearted, setDemoHearted] = useState(false);
  const [activeChip, setActiveChip] = useState(null);
  const [realCafe, setRealCafe] = useState(null);

  const toggleFavoriteCafe = useFavoritesStore((state) => state.toggleFavoriteCafe);
  const favoriteCafes = useFavoritesStore((state) => state.favoriteCafes || []);

  // Fetch real cafe data from backend database
  useEffect(() => {
    let isMounted = true;
    api.get('/cafes')
      .then((res) => {
        const items = res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
        if (isMounted && Array.isArray(items) && items.length > 0) {
          const first = items[0];
          setRealCafe({
            id: first.id || first._id,
            name: first.name || first.title || 'Artisan Roast Cafe',
            address: first.address || first.location || first.city || 'Indiranagar, Bengaluru',
            price: first.price_per_hour || first.price || 1200,
            rating: first.google_rating || first.rating || 4.9,
            image: first.cover_image || first.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80',
          });
        }
      })
      .catch((err) => {
        console.warn('Could not load real cafe for wishlist demo:', err?.message);
      });
    return () => { isMounted = false; };
  }, []);

  const isSaved = realCafe?.id ? favoriteCafes.includes(realCafe.id) : demoHearted;

  const handleToggleFavorite = () => {
    if (realCafe?.id) {
      toggleFavoriteCafe(realCafe.id);
    } else {
      setDemoHearted((prev) => !prev);
    }
  };

  const categories = [
    { label: 'Work & Wi-Fi', icon: Coffee, query: 'wifi', bg: 'bg-amber-500/10 text-amber-900 border-amber-200' },
    { label: 'Outdoor Gardens', icon: Compass, query: 'outdoor', bg: 'bg-emerald-500/10 text-emerald-900 border-emerald-200' },
    { label: 'Live Music', icon: Sparkles, query: 'live_music', bg: 'bg-purple-500/10 text-purple-900 border-purple-200' },
    { label: 'Popular Venues', icon: Flame, query: 'popular', bg: 'bg-rose-500/10 text-rose-900 border-rose-200' },
  ];

  const cafeDisplayName = realCafe?.name || 'Artisan Roast Cafe & Lounge';
  const cafeDisplayAddress = realCafe?.address || 'Indiranagar, Bengaluru';
  const cafeDisplayPrice = realCafe?.price || 1200;
  const cafeDisplayRating = realCafe?.rating || 4.9;
  const cafeDisplayImage = realCafe?.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="relative w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#DDB892]/20 via-[#6F4E37]/10 to-rose-200/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-stone-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 sm:p-10 text-center overflow-hidden"
      >
        {/* Top Floating Interactive Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] text-xs font-black tracking-wide uppercase mb-6 shadow-2xs">
          <Sparkles size={14} className="text-amber-500 animate-pulse" />
          <span>Interactive Wishlist Preview</span>
        </div>

        {/* Interactive Main Heart Icon Hero */}
        <div className="relative mb-6 flex justify-center items-center">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className="relative cursor-pointer group"
          >
            {/* Pulsing Backglow */}
            <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
              isSaved ? 'bg-rose-500/30 scale-125' : 'bg-[#6F4E37]/20 group-hover:bg-rose-400/20'
            }`} />

            {/* Circle Housing */}
            <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center border transition-all duration-300 shadow-lg ${
              isSaved 
                ? 'bg-rose-50 border-rose-300 shadow-rose-200/50' 
                : 'bg-gradient-to-br from-[#FFF8F0] via-[#F5EBE0] to-white border-[#DDB892]/60'
            }`}>
              <motion.div
                animate={isSaved ? { scale: [1, 1.3, 1] } : { y: [0, -3, 0] }}
                transition={isSaved ? { duration: 0.4 } : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              >
                <Heart 
                  size={46} 
                  className={`transition-all duration-300 ${
                    isSaved 
                      ? 'fill-rose-500 text-rose-500 drop-shadow-md' 
                      : 'text-[#6F4E37] group-hover:text-rose-500 group-hover:fill-rose-100'
                  }`} 
                />
              </motion.div>

              {/* Tap Prompt Tooltip */}
              <div className="absolute -bottom-2.5 bg-[#2C1810] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                <MousePointerClick size={10} />
                <span>{isSaved ? 'Saved!' : 'Tap me'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto font-medium leading-relaxed mb-8">
          {message}
        </p>

        {/* Real Cafe Backend Interactive Card */}
        <div className="bg-stone-50/90 border border-stone-200/80 rounded-2xl p-4 sm:p-5 max-w-md mx-auto mb-8 text-left shadow-2xs hover:border-[#DDB892] transition-colors">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-xl bg-stone-200 overflow-hidden relative flex-shrink-0 shadow-inner">
              <img 
                src={cafeDisplayImage} 
                alt={cafeDisplayName} 
                className="w-full h-full object-cover"
              />
              <button 
                type="button"
                onClick={handleToggleFavorite}
                className="absolute top-1.5 right-1.5 p-1.5 bg-white/95 backdrop-blur-xs rounded-full text-rose-500 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title={isSaved ? "Remove from favorites" : "Save to favorites"}
              >
                <Heart size={14} className={isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-400'} />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">{cafeDisplayName}</h4>
                <span className="flex items-center gap-0.5 text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
                  <Star size={10} className="fill-amber-500 text-amber-500" /> {cafeDisplayRating}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium truncate flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-[#6F4E37] flex-shrink-0" /> {cafeDisplayAddress}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] font-black text-[#2C1810]">
                  ₹{Number(cafeDisplayPrice).toLocaleString('en-IN')} <span className="text-stone-400 font-normal">/ hr</span>
                </span>
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    isSaved 
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                      : 'bg-[#6F4E37] text-white hover:bg-[#4A2C11]'
                  }`}
                >
                  {isSaved ? '✓ Saved' : '+ Save Cafe'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Quick Category Selector */}
        <div className="mb-8">
          <span className="text-[11px] font-black text-stone-400 uppercase tracking-widest block mb-3">
            Quick Explore Categories
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeChip === cat.query;
              return (
                <Link
                  key={cat.query}
                  href={`/customer/cafe?category=${cat.query}`}
                  onClick={() => setActiveChip(cat.query)}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer shadow-2xs ${cat.bg} ${
                      isSelected ? 'ring-2 ring-[#6F4E37]' : ''
                    }`}
                  >
                    <Icon size={13} />
                    <span>{cat.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={actionLink} className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#4A2C11] via-[#6F4E37] to-[#A67B5B] text-white rounded-2xl font-black text-xs sm:text-sm tracking-wide shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass size={16} />
              <span>{actionText}</span>
              <ArrowRight size={15} />
            </motion.button>
          </Link>

          <Link href="/customer/cafe?sort=popular" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame size={15} className="text-amber-600" />
              <span>Trending Venues</span>
            </motion.button>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
