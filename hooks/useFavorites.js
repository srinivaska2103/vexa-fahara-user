import { useMutation } from '@tanstack/react-query';
import { searchService } from '@/services/search.service';
import { useFavoritesStore } from '@/stores/favorites.store';
import toast from 'react-hot-toast';

export const useToggleFavorite = () => {
  const toggleFavoriteLocal = useFavoritesStore((state) => state.toggleFavoriteCafe);

  return useMutation({
    mutationFn: searchService.toggleFavorite,
    onMutate: async (cafeId) => {
      // Optimistic update
      toggleFavoriteLocal(cafeId);
      return { cafeId };
    },
    onError: (error, cafeId, context) => {
      // Revert optimistic update
      toggleFavoriteLocal(context.cafeId);
      toast.error('Failed to update favorite status');
    }
  });
};
