'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useCafeDetailsStore } from '@/stores/cafeDetails.store';
import { useEffect, useState } from 'react';

export default function GalleryLightbox({ images = [] }) {
  const { isLightboxOpen, closeLightbox, lightboxIndex, setLightboxIndex } = useCafeDetailsStore();
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isLightboxOpen]);

  const nextImage = () => {
    setDirection(1);
    setLightboxIndex((lightboxIndex + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, lightboxIndex, images.length, closeLightbox]);

  if (!isLightboxOpen || images.length === 0) return null;

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 800 : -800,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 800 : -800,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <AnimatePresence>
      {isLightboxOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-6 select-none"
        >
          {/* Header Bar */}
          <div className="flex justify-between items-center text-white z-20">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/10">
              <ImageIcon size={14} className="text-[#DDB892]" />
              <span>{lightboxIndex + 1} / {images.length}</span>
            </div>

            <button 
              onClick={closeLightbox}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          {/* Center Image Area */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            {images.length > 1 && (
              <button 
                onClick={prevImage}
                className="absolute left-2 md:left-6 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors active:scale-90"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={lightboxIndex}
                src={images[lightboxIndex]}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 350, damping: 30 }, opacity: { duration: 0.2 } }}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
                alt={`Cafe photo ${lightboxIndex + 1}`}
              />
            </AnimatePresence>

            {images.length > 1 && (
              <button 
                onClick={nextImage}
                className="absolute right-2 md:right-6 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors active:scale-90"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Carousel Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-20 max-w-xl mx-auto px-4 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > lightboxIndex ? 1 : -1);
                  setLightboxIndex(idx);
                }}
                className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                  idx === lightboxIndex 
                    ? 'ring-2 ring-[#DDB892] scale-110 opacity-100' 
                    : 'opacity-40 hover:opacity-80'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
