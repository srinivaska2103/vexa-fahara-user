import api from '@/lib/axios';

export const notificationService = {
  getNotifications: async () => (await api.get('/notifications')).data,
  markAsRead: async (id) => (await api.patch(`/notifications/${id}/read`)).data,
  markAllAsRead: async () => (await api.patch('/notifications/read-all')).data,
  deleteNotification: async (id) => (await api.delete(`/notifications/${id}`)).data,
};
