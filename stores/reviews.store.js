import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useReviewsStore = create(
  persist(
    (set, get) => ({
      // Local state for edits that aren't synced to backend due to missing endpoints
      editedReviews: {}, // { reviewId: { updatedRating, updatedReviewText, etc } }
      reportedReviews: [], // Array of review IDs the user has reported
      
      saveEditedReview: (id, updates) => {
        set((state) => ({
          editedReviews: {
            ...state.editedReviews,
            [id]: {
              ...state.editedReviews[id],
              ...updates,
              _updatedAt: new Date().toISOString()
            }
          }
        }));
      },
      
      reportReview: (id) => {
        const { reportedReviews } = get();
        if (!reportedReviews.includes(id)) {
          set({ reportedReviews: [...reportedReviews, id] });
        }
      },
      
      isReported: (id) => get().reportedReviews.includes(id),
      
      clearStore: () => set({ editedReviews: {}, reportedReviews: [] }),
    }),
    {
      name: 'fahara-reviews-storage',
      getStorage: () => localStorage,
    }
  )
);
