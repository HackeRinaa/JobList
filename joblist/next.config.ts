import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ["localhost", "vercel.app"],
    unoptimized: process.env.NODE_ENV !== "production"
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.vercel.app"]
    }
  }
};

export default nextConfig;
