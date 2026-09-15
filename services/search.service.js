import api from '@/lib/axios';
import { favoriteService } from '@/services/favorite.service';

export const searchService = {
  searchCafes: async ({ pageParam = 1, filters }) => {
    try {
      // Construct query parameters
      const params = new URLSearchParams();
      
      // Pagination
      params.append('page', pageParam);
      params.append('limit', 12);

      // Filters
      if (filters?.query) params.append('query', filters.query);
      if (
        filters?.category && 
        filters.category !== 'all' && 
        filters.category !== 'All' &&
        !filters.category.toLowerCase().includes('discount') &&
        !filters.category.toLowerCase().includes('offer')
      ) {
        params.append('category', filters.category);
      }
      if (filters?.priceRange) params.append('priceRange', filters.priceRange);
      if (filters?.rating > 0) params.append('minRating', filters.rating);
      if (filters?.openNow) params.append('openNow', 'true');
      if (filters?.availableToday) params.append('availableToday', 'true');
      if (filters?.distance < 50) params.append('maxDistance', filters.distance);
      if (filters?.capacity > 0) params.append('minCapacity', filters.capacity);
      if (filters?.amenities?.length > 0) params.append('amenities', filters.amenities.join(','));
      
      // Sorting
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      
      const response = await api.get(`/cafes?${params.toString()}`);
      const responseData = response.data;
      
      let items = responseData?.data || responseData || [];
      if (!Array.isArray(items) && responseData?.cafes) {
        items = responseData.cafes;
      }
      if (!Array.isArray(items)) {
        items = [];
      }

      return { success: true, data: items };
    } catch (error) {
      console.warn("Cafe search API warning, falling back to empty list:", error?.message);
      // Return empty array on error so UI shows friendly "No Cafes Found" instead of error page
      return { success: true, data: [] };
    }
  },

  toggleFavorite: async (cafeId) => {
    return favoriteService.toggleFavorite(cafeId);
  }
};
