import axios from 'axios';

import { useAuthStore } from '@/stores/auth.store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const state = useAuthStore.getState();
    const token = state.accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const isAuthPath = 
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh-token');

      if (isAuthPath) {
        return Promise.reject(error);
      }

      const state = useAuthStore.getState();
      const refreshToken = state.refreshToken;

      if (!refreshToken) {
        state.logout();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
        const response = await axios.post(`${baseURL}/auth/refresh-token`, { token: refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken || refreshToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
