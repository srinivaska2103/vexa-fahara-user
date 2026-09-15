import api from '@/lib/axios';

export const cafeDetailsService = {
  getCafeById: async (id) => {
    const response = await api.get(`/cafes/${id}`);
    return response.data;
  },
  
  getCafeReviews: async (id) => {
    const response = await api.get(`/reviews/cafe/${id}`);
    return response.data;
  },
  
  getSimilarCafes: async (city, category) => {
    // Basic implementation for similar cafes using the search endpoint
    const params = new URLSearchParams();
    params.append('limit', 4);
    if (city) params.append('query', city);
    if (category) params.append('category', category);
    
    const response = await api.get(`/cafes?${params.toString()}`);
    return response.data;
  },

  getEventPackageById: async (id) => {
    const response = await api.get(`/cafes/packages/${id}`); 
    return response.data;
  },

  getCafeTables: async (id) => {
    const response = await api.get(`/cafes/${id}/tables`);
    return response.data;
  },

  getTableAvailability: async (id, bookingDate, startTime, endTime) => {
    const params = new URLSearchParams();
    if (bookingDate) params.append('booking_date', bookingDate);
    if (startTime) params.append('start_time', startTime);
    if (endTime) params.append('end_time', endTime);

    const response = await api.get(`/cafes/${id}/tables/availability?${params.toString()}`);
    return response.data;
  }
};
