import api from '@/lib/axios';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
  getAddresses: async () => ({ success: true, data: [] }),
  addAddress: async (data) => ({ success: true, data }),
};
