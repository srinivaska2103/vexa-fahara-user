const fs = require('fs');
const path = require('path');

const baseDir = 'd:\\Srinivas\\faharauser';
const componentsDir = path.join(baseDir, 'app/components/profile');
const pagesDir = path.join(baseDir, 'app/customer');
const servicesDir = path.join(baseDir, 'services');

const components = [
  'ProfileCard', 'ProfileHeader', 'ProfileAvatar', 'EditProfileForm',
  'AddressCard', 'AddressForm', 'NotificationCard', 'NotificationCenter',
  'NotificationFilter', 'NotificationTabs', 'NotificationSettings',
  'PrivacySettings', 'SecuritySettings', 'PasswordForm', 'EmailPreferences',
  'ThemeSettings', 'LanguageSelector', 'AccountSettings',
  'DeleteAccountModal', 'LogoutModal', 'LoadingProfile', 'EmptyNotifications'
];

const pages = [
  'notifications',
  'profile',
  'profile/edit',
  'settings',
  'security',
  'addresses'
];

// Create directories
fs.mkdirSync(componentsDir, { recursive: true });
pages.forEach(p => fs.mkdirSync(path.join(pagesDir, p), { recursive: true }));

// Create components
components.forEach(comp => {
  const fileContent = `import React from 'react';\n\nexport default function ${comp}() {\n  return (\n    <div className="p-4 bg-white rounded-lg shadow-sm">\n      <h2 className="text-xl font-bold">${comp} Component</h2>\n      <p className="text-gray-500">This is a placeholder for ${comp}.</p>\n    </div>\n  );\n}\n`;
  fs.writeFileSync(path.join(componentsDir, `${comp}.jsx`), fileContent);
});

// Create pages
pages.forEach(p => {
  const componentName = p.split('/').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Page';
  const fileContent = `import React from 'react';\n\nexport default function ${componentName}() {\n  return (\n    <div className="min-h-screen bg-[#FFF8F0] p-8">\n      <h1 className="text-3xl font-bold text-[#2C1810] mb-8">${componentName}</h1>\n      <p>Placeholder content for ${p}</p>\n    </div>\n  );\n}\n`;
  fs.writeFileSync(path.join(pagesDir, p, 'page.jsx'), fileContent);
});

// Create services
const notificationService = `import api from '@/lib/axios';\n\nexport const notificationService = {\n  getNotifications: async () => (await api.get('/notifications')).data,\n  markAsRead: async (id) => (await api.patch(\`/notifications/\${id}/read\`)).data,\n  markAllAsRead: async () => (await api.patch('/notifications/read-all')).data,\n  deleteNotification: async (id) => (await api.delete(\`/notifications/\${id}\`)).data,\n};\n`;
fs.writeFileSync(path.join(servicesDir, 'notification.service.js'), notificationService);

const profileService = `export const profileService = {\n  getProfile: async () => ({ success: true, data: { name: 'John Doe', email: 'john@example.com' } }),\n  updateProfile: async (data) => ({ success: true, data }),\n  getAddresses: async () => ({ success: true, data: [] }),\n  addAddress: async (data) => ({ success: true, data }),\n};\n`;
fs.writeFileSync(path.join(servicesDir, 'profile.service.js'), profileService);

const settingsService = `export const settingsService = {\n  getSettings: async () => ({ success: true, data: { theme: 'light', notifications: true } }),\n  updateSettings: async (data) => ({ success: true, data }),\n  changePassword: async (data) => ({ success: true }),\n};\n`;
fs.writeFileSync(path.join(servicesDir, 'settings.service.js'), settingsService);

console.log("Phase 11 Scaffolding Complete!");
