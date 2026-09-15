import api from '@/lib/axios';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
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
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (!token) {
          return { success: true, data: [] };
        }
      }
      const response = await api.get('/bookings/my-bookings');
      return response.data;
    } catch (error) {
      return { success: false, data: [] };
    }
  },

  cancelBooking: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }
};
