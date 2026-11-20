export default function manifest() {
  return {
    name: 'Grab2GO • Cafe & Food Delivery Platform',
    short_name: 'Grab2GO',
    description: 'Discover cafes, book event spaces, and order delicious food with Grab2GO.',
    start_url: '/customer/cafe',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#E50914',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['food', 'lifestyle', 'shopping'],
  };
}
