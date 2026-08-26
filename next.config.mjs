/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/owner/login',
        destination: process.env.NEXT_PUBLIC_CAFE_MANAGER_URL ? `${process.env.NEXT_PUBLIC_CAFE_MANAGER_URL}/owner/login` : 'http://localhost:3001/owner/login',
        permanent: false,
      },
      {
        source: '/partner/cafe',
        destination: process.env.NEXT_PUBLIC_CAFE_MANAGER_URL ? `${process.env.NEXT_PUBLIC_CAFE_MANAGER_URL}/owner/login` : 'http://localhost:3001/owner/login',
        permanent: false,
      },
      {
        source: '/partner/event',
        destination: process.env.NEXT_PUBLIC_EVENT_MANAGER_URL ? `${process.env.NEXT_PUBLIC_EVENT_MANAGER_URL}/event/login` : 'http://localhost:3002/event/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
