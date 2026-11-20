import api from '@/lib/axios';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  checkCapacity: async (params) => {
    const response = await api.post('/bookings/capacity-check', params);
    return response.data;
  },


  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  getBookingPricing: async (id) => {
    const response = await api.get(`/bookings/${id}/pricing`);
    return response.data;
  },

  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings/my-bookings', { timeout: 15000 });
      return response.data;
    } catch (error) {
      console.warn('Could not load user booking history:', error?.message);
      return { success: false, data: [] };
    }
  },

  cancelBooking: async (id, reason = '') => {
    const response = await api.patch(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }
};
