import { create } from 'zustand';

export const useCafeDetailsStore = create((set) => ({
  // Lightbox State
  isLightboxOpen: false,
  lightboxIndex: 0,
  
  openLightbox: (index = 0) => set({ isLightboxOpen: true, lightboxIndex: index }),
  closeLightbox: () => set({ isLightboxOpen: false }),
  setLightboxIndex: (index) => set({ lightboxIndex: index }),

  // Mobile Sticky Bar State
  isBookingBarVisible: true,
  setBookingBarVisible: (visible) => set({ isBookingBarVisible: visible }),
}));
