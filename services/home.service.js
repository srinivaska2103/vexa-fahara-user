import api from '@/lib/axios';

export const homeService = {
  getFeaturedCafes: async () => {
    // Assuming backend returns an array of featured cafes
    const response = await api.get('/cafes?isFeatured=true&limit=10');
    return response.data;
  },
  
  getPopularCafes: async () => {
    const response = await api.get('/cafes?sort=rating&limit=8');
    return response.data;
  },

  getTrendingCafes: async () => {
    const response = await api.get('/cafes?sort=trending&limit=8');
    return response.data;
  },

  getTopRatedCafes: async () => {
    const response = await api.get('/cafes?sort=rating_desc&limit=6');
    return response.data;
  },

  getPopularEvents: async () => {
    const response = await api.get('/event-services?sort=popular&limit=8');
    return response.data;
  },

  getEventServiceById: async (id) => {
    const response = await api.get(`/event-services/${id}`);
    return response.data;
  },

  getNearbyCafes: async (lat, lng) => {
    const response = await api.get(`/cafes?lat=${lat}&lng=${lng}&radius=10`);
    return response.data;
  }
};
