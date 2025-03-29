// next.config.ts
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
  experimental: {
    optimizeCss: {
      // Add explicit critters configuration
      critters: {
        // Critters options here
        preload: 'media',
        inlineFonts: true,
      }
    },
  },
}

module.exports = nextConfig