// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    minimumCacheTTL: 60,
  },
  // Optional experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  // Add a custom webpack configuration to optimize image loading
  webpack: (config, { isServer }) => {
    // Add image optimization plugins if needed
    return config;
  },
}

module.exports = nextConfig