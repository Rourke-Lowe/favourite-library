/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig