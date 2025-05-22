import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["localhost", "vercel.app"],
    unoptimized: true
  },
  // Completely disable static generation and use server-side rendering
  output: 'standalone',
  distDir: '.next',
  // Disable static pages generation
  staticPageGenerationTimeout: 0,
  // Disable page optimization
  compress: false,
  // Disable type checking
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Disable ESLint
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Configure environment for production
  env: {
    NODE_ENV: 'production',
    NEXT_DISABLE_ESLINT: '1',
    SKIP_TYPE_CHECK: '1'
  },
  // Disable experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.vercel.app"]
    }
  },
};

export default nextConfig;
