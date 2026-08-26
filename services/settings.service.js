export const settingsService = {
  getSettings: async () => ({ success: true, data: { theme: 'light', notifications: true } }),
  updateSettings: async (data) => ({ success: true, data }),
  changePassword: async (data) => ({ success: true }),
};
