import api from '@/lib/axios';

export const paymentService = {
  createOrder: async (bookingId) => {
    const response = await api.post('/payments/create-order', { bookingId });
    return response.data;
  },

  verifyPayment: async (payload) => {
    try {
      const body = typeof payload === 'string' ? { orderId: payload } : (payload || {});
      const response = await api.post('/payments/verify', body);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }
};
