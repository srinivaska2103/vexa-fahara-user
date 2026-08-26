import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper to sync auth token with browser cookies for Next.js middleware
const syncCookie = (token) => {
  if (typeof document !== 'undefined') {
    if (token) {
      document.cookie = `accessToken=${token}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
  }
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (user, accessToken, refreshToken) => {
        syncCookie(accessToken);
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      setTokens: (accessToken, refreshToken) => {
        syncCookie(accessToken);
        set((state) => ({ ...state, accessToken, refreshToken }));
      },

      setUser: (user) =>
        set((state) => ({ ...state, user: state.user ? { ...state.user, ...user } : user })),

      logout: () => {
        syncCookie(null);
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'fahara-auth-storage',
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          syncCookie(state.accessToken);
        }
        useAuthStore.setState({ isHydrated: true });
      },
    }
  )
);
