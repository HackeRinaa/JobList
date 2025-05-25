/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['pdfjs-dist']);

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "vercel.app"],
    unoptimized: true
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['pdfjs-dist'],
  webpack: (config, { isServer }) => {
    // Add polyfills for browser-only modules when used on the server
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        http: false,
        https: false,
        url: false,
        util: false,
        zlib: false,
        path: false,
        stream: false,
        crypto: false,
        canvas: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = withTM(nextConfig); 