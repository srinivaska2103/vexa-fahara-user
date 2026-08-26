import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlistItems: [],
      
      toggleWishlist: (id) => {
        const { wishlistItems } = get();
        if (wishlistItems.includes(id)) {
          set({ wishlistItems: wishlistItems.filter(itemId => itemId !== id) });
        } else {
          set({ wishlistItems: [...wishlistItems, id] });
        }
      },

      isInWishlist: (id) => get().wishlistItems.includes(id),
      
      clearWishlist: () => set({ wishlistItems: [] }),
    }),
    {
      name: 'fahara-wishlist-storage',
      getStorage: () => localStorage,
    }
  )
);
