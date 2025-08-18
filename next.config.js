/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression
  compress: true,
  
  // Bundle analyzer is a separate plugin, not a Next.js config option
  
  // Performance optimizations
  poweredByHeader: false,
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Static export configuration (comment out if using Vercel)
  // output: 'export',
  // trailingSlash: true,
  // images: { unoptimized: true },
}

module.exports = nextConfig