import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favoriteCafes: [],
      favoriteEvents: [],
      
      toggleFavoriteCafe: (id) => {
        const { favoriteCafes } = get();
        if (favoriteCafes.includes(id)) {
          set({ favoriteCafes: favoriteCafes.filter(cafeId => cafeId !== id) });
        } else {
          set({ favoriteCafes: [...favoriteCafes, id] });
        }
      },

      toggleFavoriteEvent: (id) => {
        const { favoriteEvents } = get();
        if (favoriteEvents.includes(id)) {
          set({ favoriteEvents: favoriteEvents.filter(eventId => eventId !== id) });
        } else {
          set({ favoriteEvents: [...favoriteEvents, id] });
        }
      },

      isFavoriteCafe: (id) => get().favoriteCafes.includes(id),
      isFavoriteEvent: (id) => get().favoriteEvents.includes(id),
      
      clearFavorites: () => set({ favoriteCafes: [], favoriteEvents: [] }),
    }),
    {
      name: 'fahara-favorites-storage',
      getStorage: () => localStorage,
    }
  )
);
