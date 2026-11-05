import { create } from 'zustand';
import api from '@/lib/axios';

export const useCartStore = create((set, get) => ({
  cart: null,
  itemCount: 0,
  subtotal: 0,
  totalSavings: 0,
  finalPayableAmount: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.get('/customer/cart');
      if (res.data?.success) {
        const cart = res.data.data;
        set({
          cart,
          itemCount: cart.itemCount || 0,
          subtotal: cart.subtotal || 0,
          totalSavings: cart.totalSavings || 0,
          finalPayableAmount: cart.finalPayableAmount || 0,
          isLoading: false
        });
      }
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to fetch cart' });
    }
  },

  addItem: async ({ cafeId, menuItemId, quantity = 1, forceReplace = false }) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.post('/customer/cart/items', {
        cafeId,
        menuItemId,
        quantity,
        forceReplace
      });

      if (res.data?.success) {
        const cart = res.data.data;
        set({
          cart,
          itemCount: cart.itemCount || 0,
          subtotal: cart.subtotal || 0,
          totalSavings: cart.totalSavings || 0,
          finalPayableAmount: cart.finalPayableAmount || 0,
          isLoading: false
        });
        return { success: true };
      }
    } catch (err) {
      set({ isLoading: false });
      if (err.response?.status === 409 && err.response?.data?.requiresConfirmation) {
        return {
          requiresConfirmation: true,
          existingCafe: err.response.data.existingCafe,
          message: err.response.data.message
        };
      }
      throw err;
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    try {
      const res = await api.patch(`/customer/cart/items/${cartItemId}`, { quantity });
      if (res.data?.success) {
        const cart = res.data.data;
        set({
          cart,
          itemCount: cart.itemCount || 0,
          subtotal: cart.subtotal || 0,
          totalSavings: cart.totalSavings || 0,
          finalPayableAmount: cart.finalPayableAmount || 0
        });
      }
    } catch (err) {
      throw err;
    }
  },

  removeItem: async (cartItemId) => {
    try {
      const res = await api.delete(`/customer/cart/items/${cartItemId}`);
      if (res.data?.success) {
        const cart = res.data.data;
        set({
          cart,
          itemCount: cart.itemCount || 0,
          subtotal: cart.subtotal || 0,
          totalSavings: cart.totalSavings || 0,
          finalPayableAmount: cart.finalPayableAmount || 0
        });
      }
    } catch (err) {
      throw err;
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/customer/cart');
      set({
        cart: null,
        itemCount: 0,
        subtotal: 0,
        totalSavings: 0,
        finalPayableAmount: 0
      });
    } catch (err) {
      throw err;
    }
  }
}));

