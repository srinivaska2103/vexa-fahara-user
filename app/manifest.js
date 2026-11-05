export default function manifest() {
  return {
    name: 'Grab2GO • Cafe & Event Booking Platform',
    short_name: 'Grab2GO',
    description: 'Book top-rated cafes, private venues, packages, and event spaces near you.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF5F5',
    theme_color: '#E50914',
    orientation: 'portrait',
    icons: [
      {
        src: '/grab-it-logo.png',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/grab-it-logo.png',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
    shortcuts: [
      {
        name: 'My Bookings',
        url: '/customer/bookings',
        description: 'View active and past cafe bookings',
      },
      {
        name: 'Explore Cafes',
        url: '/',
        description: 'Discover top cafes and event spots',
      },
    ],
    categories: ['lifestyle', 'food', 'entertainment', 'productivity'],
  };
}
