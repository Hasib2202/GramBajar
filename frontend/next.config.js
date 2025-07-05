const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Add this images configuration
  images: {
    domains: [
      'res.cloudinary.com',       // Cloudinary images
      'localhost',                // Local development
      'your-production-domain.com' // Your production domain
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dksekryws/image/upload/**',
      },
    ],
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = nextConfig;