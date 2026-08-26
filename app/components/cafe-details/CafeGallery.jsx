'use client';

import { useState } from 'react';
import { Grid, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useCafeDetailsStore } from '@/stores/cafeDetails.store';
import { motion } from 'framer-motion';

export default function CafeGallery({ cafe }) {
  const { openLightbox } = useCafeDetailsStore();
  
  // Real cover image and gallery images from backend API
  const rawGallery = cafe?.gallery || [];
  const galleryArray = Array.isArray(rawGallery) ? rawGallery : [];
  
  const coverImg = cafe?.cover_image || cafe?.coverImage || cafe?.image;
  const images = [coverImg, ...galleryArray].filter(Boolean);

  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
  
  if (images.length === 0) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] bg-stone-100 border border-stone-200/80 rounded-3xl flex flex-col items-center justify-center text-stone-400 mb-8 shadow-xs">
        <ImageIcon size={44} className="mb-2 opacity-40 text-stone-500" />
        <span className="font-bold text-stone-500 text-sm tracking-wide">No images available for this cafe</span>
      </div>
    );
  }

  const displayImages = images.slice(0, 5);
  const totalCount = images.length;
  const hasGrid = images.length > 1;

  const currentFeaturedImg = displayImages[activeFeaturedIndex] || displayImages[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="relative mb-8 group"
    >
      <div className={`grid grid-cols-1 ${hasGrid ? 'lg:grid-cols-3' : ''} gap-2.5 sm:gap-3 rounded-3xl overflow-hidden h-[300px] sm:h-[420px] md:h-[480px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-stone-200/80`}>
        
        {/* Featured Cover Image */}
        <div 
          className={`${hasGrid ? 'lg:col-span-2' : 'w-full'} h-full cursor-pointer overflow-hidden relative group/item bg-stone-900`}
          onClick={() => openLightbox(activeFeaturedIndex)}
        >
          <motion.img 
            key={activeFeaturedIndex}
            src={currentFeaturedImg} 
            alt={cafe?.name || "Cafe featured photo"} 
            initial={{ opacity: 0.8, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover/item:opacity-40 transition-opacity duration-300" />
          
          <div className="absolute top-3 left-3 sm:bottom-4 sm:top-auto sm:left-4 flex items-center gap-2 z-10">
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-white/95 backdrop-blur-md text-[#2C1810] font-black text-[10px] sm:text-xs rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#6F4E37]" />
              {activeFeaturedIndex === 0 ? 'Featured Cover Photo' : `Photo ${activeFeaturedIndex + 1} of ${totalCount}`}
            </span>
          </div>
        </div>
        
        {/* Gallery Thumbnails Grid (Hover/Click to Swap Main Photo) */}
        {hasGrid && (
          <div className="hidden sm:grid grid-cols-2 gap-2.5 sm:gap-3 h-full">
            {[1, 2, 3, 4].map((idx) => {
              const imgSrc = displayImages[idx] || displayImages[0];
              const isSelected = activeFeaturedIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`w-full h-full cursor-pointer overflow-hidden relative group/item rounded-2xl bg-stone-100 transition-all ${
                    isSelected ? 'ring-4 ring-[#6F4E37] ring-offset-2' : ''
                  }`}
                  onClick={() => {
                    setActiveFeaturedIndex(idx < displayImages.length ? idx : 0);
                  }}
                >
                  <img 
                    src={imgSrc} 
                    alt={`Gallery photo ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/15 transition-colors duration-300" />
                  
                  {idx === 3 && totalCount > 4 && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(0);
                      }}
                      className="absolute inset-0 bg-black/55 backdrop-blur-2xs flex flex-col items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <span className="text-white font-black text-xl tracking-tight">
                        +{totalCount - 4}
                      </span>
                      <span className="text-stone-200 text-[10px] font-extrabold uppercase tracking-wider">Show Lightbox</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Floating "Show Photos" Button */}
      <motion.button 
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => openLightbox(activeFeaturedIndex)}
        className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 bg-white/95 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-stone-200/80 flex items-center gap-1.5 font-extrabold text-[11px] sm:text-sm text-[#2C1810] hover:bg-white hover:text-[#6F4E37] transition-all z-10 cursor-pointer"
      >
        <Grid size={15} className="text-[#6F4E37]" />
        <span>Expand Lightbox ({totalCount})</span>
      </motion.button>
    </motion.div>
  );
}
