// nextconfig.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Output directory
  distDir: '.next',
  // If you need experimental features
  experimental: {
    // Any experimental features you're using
  }
}

export default nextConfig
