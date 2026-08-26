import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCompareStore = create(
  persist(
    (set, get) => ({
      compareCafes: [],
      compareEvents: [],
      
      toggleCompareCafe: (id) => {
        const { compareCafes } = get();
        if (compareCafes.includes(id)) {
          set({ compareCafes: compareCafes.filter(cafeId => cafeId !== id) });
        } else {
          if (compareCafes.length >= 3) {
            toast.error('You can only compare up to 3 cafes at once.');
            return;
          }
          set({ compareCafes: [...compareCafes, id] });
          toast.success('Added to comparison');
        }
      },

      toggleCompareEvent: (id) => {
        const { compareEvents } = get();
        if (compareEvents.includes(id)) {
          set({ compareEvents: compareEvents.filter(eventId => eventId !== id) });
        } else {
          if (compareEvents.length >= 3) {
            toast.error('You can only compare up to 3 event companies at once.');
            return;
          }
          set({ compareEvents: [...compareEvents, id] });
          toast.success('Added to comparison');
        }
      },

      isCompareCafe: (id) => get().compareCafes.includes(id),
      isCompareEvent: (id) => get().compareEvents.includes(id),
      
      clearCompare: () => set({ compareCafes: [], compareEvents: [] }),
    }),
    {
      name: 'fahara-compare-storage',
      getStorage: () => localStorage,
    }
  )
);
