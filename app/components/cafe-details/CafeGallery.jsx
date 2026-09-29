'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Sparkles, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  Grid 
} from 'lucide-react';
import { useCafeDetailsStore } from '@/stores/cafeDetails.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useToggleFavorite } from '@/hooks/useFavorites';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CafeGallery({ cafe }) {
  const { openLightbox } = useCafeDetailsStore();
  
  // Real cover image and gallery array from backend API
  const rawGallery = cafe?.gallery || cafe?.photos || cafe?.images || [];
  const galleryArray = Array.isArray(rawGallery) 
    ? rawGallery.map(img => typeof img === 'string' ? img : (img?.file_url || img?.url || ''))
    : [];

  const coverImg = cafe?.cover_image || cafe?.coverImage || cafe?.image || cafe?.profile_image;
  
  // Combine & filter out invalid/empty images
  const allImages = [coverImg, ...galleryArray]
    .filter(Boolean)
    .map(url => String(url).trim())
    .filter((url, index, self) => url.length > 0 && self.indexOf(url) === index);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Wishlist integration
  const cafeId = cafe?.id;
  const isFav = useFavoritesStore((state) => state.isFavoriteCafe(cafeId));
  const toggleFavoriteMutation = useToggleFavorite();

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (cafeId) {
      toggleFavoriteMutation.mutate(cafeId);
    }
  };

  // Touch swipe handling for mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;

    if (diffX > 40) {
      // Swiped Left -> Next Image
      nextImage();
    } else if (diffX < -40) {
      // Swiped Right -> Previous Image
      prevImage();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const nextImage = () => {
    if (allImages.length <= 1) return;
    setDirection(1);
    setIsLoaded(false);
    setHasError(false);
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    if (allImages.length <= 1) return;
    setDirection(-1);
    setIsLoaded(false);
    setHasError(false);
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setIsLoaded(false);
    setHasError(false);
    setCurrentIndex(index);
  };

  // Preload adjacent images
  useEffect(() => {
    if (allImages.length > 1) {
      const nextIdx = (currentIndex + 1) % allImages.length;
      const prevIdx = (currentIndex - 1 + allImages.length) % allImages.length;
      
      const imgNext = new Image();
      imgNext.src = allImages[nextIdx];
      const imgPrev = new Image();
      imgPrev.src = allImages[prevIdx];
    }
  }, [currentIndex, allImages]);

  // NO IMAGES STATE
  if (allImages.length === 0) {
    return (
      <div className="w-full h-[260px] sm:h-[360px] md:h-[420px] bg-[#FFF8F0] border border-[#DDB892]/40 rounded-3xl flex flex-col items-center justify-center text-[#2C1810]/60 mb-6 shadow-xs relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-[#6F4E37]/10 flex items-center justify-center mb-3">
          <ImageIcon size={32} className="text-[#6F4E37] opacity-60" />
        </div>
        <span className="font-extrabold text-[#2C1810] text-sm tracking-tight">Cafe photo unavailable</span>
        <p className="text-xs text-text/50 mt-1">Check back later for gallery updates</p>

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label="Add cafe to wishlist"
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-md flex items-center justify-center transition-transform active:scale-90 hover:scale-105 z-20 cursor-pointer"
        >
          <Heart 
            size={20} 
            className={cn(
              "transition-colors",
              isFav ? "fill-[#6F4E37] text-[#6F4E37]" : "text-[#2C1810] stroke-[2]"
            )} 
          />
        </button>
      </div>
    );
  }

  const currentImageUrl = allImages[currentIndex];
  const totalImages = allImages.length;

  // Smart dot pagination slicer for long galleries (>6 dots)
  const getVisibleDotIndices = () => {
    if (totalImages <= 6) return allImages.map((_, i) => i);
    const start = Math.max(0, Math.min(currentIndex - 2, totalImages - 6));
    return Array.from({ length: 6 }, (_, i) => start + i);
  };

  const visibleDotIndices = getVisibleDotIndices();

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0.9,
    }),
  };

  return (
    <div className="space-y-3 mb-6">
      
      {/* Main Mobile Hero Image Gallery Container */}
      <div 
        className="relative w-full h-[280px] sm:h-[380px] md:h-[460px] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-stone-200/80 bg-stone-900 group select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Loading Shimmer Skeleton */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse z-0 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-stone-400 opacity-40" />
          </div>
        )}

        {/* Hero Image Presentation */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
            onClick={() => openLightbox(currentIndex)}
            className="w-full h-full cursor-pointer relative"
          >
            {hasError ? (
              <div className="w-full h-full bg-[#FFF8F0] flex flex-col items-center justify-center text-[#2C1810]/60 p-4">
                <ImageIcon className="w-12 h-12 text-[#6F4E37] opacity-40 mb-2" />
                <span className="text-xs font-bold text-[#2C1810]">Image failed to load</span>
              </div>
            ) : (
              <img
                src={currentImageUrl}
                alt={cafe?.name ? `Photo of ${cafe.name}` : `View cafe photo ${currentIndex + 1} of ${totalImages}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                  setIsLoaded(true);
                  setHasError(true);
                }}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  isLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            )}

            {/* Subtle Gradient Overlays for UI contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Floating Circular Wishlist Button (Top-Right) */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isFav ? "Remove cafe from wishlist" : "Add cafe to wishlist"}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-md flex items-center justify-center transition-transform active:scale-90 hover:scale-105 z-20 cursor-pointer"
        >
          <Heart 
            size={20} 
            className={cn(
              "transition-colors",
              isFav ? "fill-[#6F4E37] text-[#6F4E37]" : "text-[#2C1810] stroke-[2.2]"
            )} 
          />
        </button>

        {/* Dynamic Photo Counter (Bottom-Left Pill) */}
        {totalImages > 0 && (
          <div className="absolute bottom-3.5 left-3.5 sm:bottom-4 sm:left-4 z-20 pointer-events-none">
            <div className="px-3 py-1 bg-black/60 backdrop-blur-md text-white font-extrabold text-xs rounded-full shadow-md border border-white/10 flex items-center gap-1.5 tracking-wider">
              <span>{currentIndex + 1} / {totalImages}</span>
            </div>
          </div>
        )}

        {/* Expand Lightbox Button (Bottom-Right) */}
        <button
          type="button"
          onClick={() => openLightbox(currentIndex)}
          aria-label="Open cafe photo gallery fullscreen"
          className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-md border border-stone-200/80 flex items-center gap-1.5 text-xs font-black text-[#2C1810] hover:text-[#6F4E37] transition-all z-20 cursor-pointer active:scale-95"
        >
          <Maximize2 size={13} className="text-[#6F4E37]" />
          <span className="hidden sm:inline">Fullscreen</span>
        </button>

        {/* Optional Desktop Arrow Controls (hidden on mobile swipe) */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous cafe photo"
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2C1810] shadow-md backdrop-blur-md items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next cafe photo"
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2C1810] shadow-md backdrop-blur-md items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dot Indicators (Below Gallery Image) */}
      {totalImages > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-1 z-10">
          {visibleDotIndices.map((idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goToImage(idx)}
                aria-label={`View cafe photo ${idx + 1} of ${totalImages}`}
                className={cn(
                  "transition-all cursor-pointer rounded-full",
                  isActive 
                    ? "w-2.5 h-2.5 bg-[#6F4E37] scale-125 shadow-2xs" 
                    : "w-2 h-2 bg-[#6F4E37]/30 hover:bg-[#6F4E37]/60"
                )}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
