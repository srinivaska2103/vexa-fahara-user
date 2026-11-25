import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Helper to auto-resume pending cart actions after authentication
const resumePendingCartAction = async () => {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    const pendingRaw = sessionStorage.getItem('pending_cart_item');
    if (pendingRaw) {
      const pendingItem = JSON.parse(pendingRaw);
      sessionStorage.removeItem('pending_cart_item');
      if (pendingItem?.cafeId && pendingItem?.menuItemId) {
        const { addItem } = useCartStore.getState();
        await addItem({
          cafeId: pendingItem.cafeId,
          menuItemId: pendingItem.menuItemId,
          quantity: pendingItem.quantity || 1
        });
        toast.success(`Added ${pendingItem.name || 'item'} to your cart!`, { duration: 4000 });
      }
    }
  } catch (err) {
    console.warn('[Cart Resume] Failed to add pending item:', err);
  }
};

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data, variables) => {
      toast.success('An OTP has been sent to your registered email.');
      const userId = data?.userId || data?.user?.id || data?.id;
      const param = userId ? `id=${encodeURIComponent(userId)}` : `email=${encodeURIComponent(variables.email)}`;
      router.push(`/verify-email?${param}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

export const useVerifyOTP = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.verifyOTP,
    onSuccess: async (data) => {
      if (data?.accessToken || data?.data?.accessToken) {
        const payload = data.data || data;
        setAuth(payload.user, payload.accessToken, payload.refreshToken);
        document.cookie = `accessToken=${payload.accessToken}; path=/; max-age=604800; SameSite=Lax`;
        toast.success('Email verified successfully!');
        await resumePendingCartAction();
        
        let targetUrl = '/customer/cafe';
        if (typeof window !== 'undefined') {
          const stored = sessionStorage.getItem('post_login_redirect');
          if (stored && stored.startsWith('/')) {
            targetUrl = stored;
            sessionStorage.removeItem('post_login_redirect');
          }
        }
        router.push(targetUrl);
      } else {
        toast.success('Email verified successfully. Please login.');
        router.push('/login');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const userRole = data?.user?.role?.toUpperCase();
      if (userRole && userRole !== 'CUSTOMER') {
        toast.error("You don't have permission to login in this portal");
        return;
      }

      setAuth(data.user, data.accessToken, data.refreshToken);
      // Set cookie for Next.js middleware with 7 day max-age
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
      toast.success('Login successful');

      // Check for redirect query param or stored return url
      let targetUrl = '/customer/cafe';
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get('redirect') || urlParams.get('returnUrl');
        if (redirectParam && redirectParam.startsWith('/')) {
          targetUrl = redirectParam;
        } else {
          const stored = sessionStorage.getItem('post_login_redirect');
          if (stored && stored.startsWith('/')) {
            targetUrl = stored;
            sessionStorage.removeItem('post_login_redirect');
          }
        }
      }

      // Resume pending cart item if guest clicked "Add to Cart" prior to authenticating
      resumePendingCartAction();

      router.push(targetUrl);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "You don't have permission to login in this portal");
    },
  });
};

export const useForgotPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data, variables) => {
      toast.success('Check your email for the verification code.');
      const userId = data?.userId || data?.user?.id;
      const param = userId ? `id=${encodeURIComponent(userId)}` : `email=${encodeURIComponent(variables.email)}`;
      router.push(`/reset-password?${param}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Password updated successfully.');
      router.push('/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    },
  });
};

export const useLogout = () => {
  const logoutAction = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logoutAction();
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('fahara-auth-storage');
      }
      toast.success('Logout successful');
      window.location.href = '/login';
    },
    onError: (error) => {
      // Even if API fails, clear local state
      logoutAction();
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('fahara-auth-storage');
      }
      window.location.href = '/login';
    },
  });
};
