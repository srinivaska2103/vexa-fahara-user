import api from '@/lib/axios';

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', { ...data, roleName: 'CUSTOMER' });
    return response.data;
  },

  verifyOTP: async (data) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/auth/login', { ...data, expectedRole: 'CUSTOMER' });
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await api.post('/auth/forgot-password', { ...data, expectedRole: 'CUSTOMER' });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  refreshToken: async (token) => {
    const response = await api.post('/auth/refresh-token', { token });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
