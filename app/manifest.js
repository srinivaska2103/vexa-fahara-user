export default function manifest() {
  return {
    name: 'Fahara • Cafe & Event Booking Platform',
    short_name: 'Fahara',
    description: 'Book top-rated cafes, private venues, packages, and event spaces near you.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8F0',
    theme_color: '#6F4E37',
    orientation: 'portrait',
    icons: [
      {
        src: '/Fahara%20Logo.jpeg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/Fahara%20Logo.jpeg',
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
