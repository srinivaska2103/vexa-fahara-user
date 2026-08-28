import api from '@/lib/axios';

export const favoriteService = {
  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch favorites from API:', error);
      return { success: false, data: [] };
    }
  },

  getFavoriteIds: async () => {
    try {
      const response = await api.get('/favorites/ids');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch favorite IDs from API:', error);
      return { success: false, data: [] };
    }
  },

  toggleFavorite: async (cafeId) => {
    try {
      const response = await api.post('/favorites/toggle', { cafeId });
      return response.data;
    } catch (error) {
      console.error('Failed to toggle favorite API:', error);
      throw error;
    }
  },
};
