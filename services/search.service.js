import api from '@/lib/axios';

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
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
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

      // If category filter is active, filter cafes by cafe packages / event_type / category
      if (filters?.category && filters.category !== 'all' && filters.category !== '') {
        const catSearch = filters.category.toLowerCase().trim();
        const categoryMatches = items.filter(cafe => {
          const name = (cafe.name || '').toLowerCase();
          const desc = (cafe.description || '').toLowerCase();
          const cat = (cafe.category || cafe.event_type || '').toLowerCase();
          const city = (cafe.city || cafe.address || '').toLowerCase();
          
          // Check package names, event_type, or inclusions for event category match
          const packages = (cafe.cafe_packages || []).map(p => {
            const pName = p.package_name || p.name || '';
            const pEvent = p.event_type || p.event_type_name || '';
            const pDesc = p.description || '';
            return `${pName} ${pEvent} ${pDesc}`.toLowerCase();
          }).join(' ');

          return (
            cat.includes(catSearch) || 
            name.includes(catSearch) || 
            desc.includes(catSearch) || 
            city.includes(catSearch) ||
            packages.includes(catSearch)
          );
        });

        return { 
          success: true, 
          data: categoryMatches 
        };
      }

      return { success: true, data: items };
    } catch (error) {
      console.warn("Cafe search API warning, falling back to empty list:", error?.message);
      // Return empty array on error so UI shows friendly "No Cafes Found" instead of error page
      return { success: true, data: [] };
    }
  },

  toggleFavorite: async (cafeId) => {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 300));
  }
};
