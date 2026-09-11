import api from '@/lib/axios';

export const loyaltyService = {
  getSummary: async () => {
    const response = await api.get('/loyalty');
    return response.data;
  },
  getTransactions: async (page = 1, limit = 20) => {
    const response = await api.get(`/loyalty/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },
  getRedemptions: async (page = 1, limit = 20) => {
    const response = await api.get(`/loyalty/redemptions?page=${page}&limit=${limit}`);
    return response.data;
  },
  redeem: async (credits) => {
    const response = await api.post('/loyalty/redeem', { credits });
    return response.data;
  }
};
