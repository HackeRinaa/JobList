/** @type {import('next').NextConfig} */

// Using direct configuration instead of the next-transpile-modules package
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['pdfjs-dist', 'leaflet', 'react-leaflet'],
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
    
    // Handle CSS files properly
    const rules = config.module.rules;
    
    // Add rule for CSS modules
    const cssRule = rules.find(rule => 
      rule.oneOf && 
      rule.oneOf.some(oneRule => 
        oneRule.test && oneRule.test.toString().includes('css')
      )
    );
    
    if (cssRule) {
      const cssModuleRules = cssRule.oneOf.filter(rule => 
        rule.test && rule.test.toString().includes('css') && 
        rule.use && Array.isArray(rule.use) && 
        rule.use.some(use => use.loader && use.loader.includes('css-loader'))
      );
      
      for (const rule of cssModuleRules) {
        if (rule.use) {
          for (const item of rule.use) {
            if (item.loader && item.loader.includes('css-loader') && item.options) {
              // Ensure CSS modules are handled properly
              if (item.options.modules) {
                item.options.modules = {
                  ...item.options.modules,
                  auto: true, // This helps with the @tailwind directives
                };
              }
            }
          }
        }
      }
    }
    
    return config;
  },
  
  // Additional configuration for handling CSS
  experimental: {
    esmExternals: 'loose', // This helps with ESM packages
  },
  
  // Ensure images from leaflet can be loaded
  images: {
    domains: ["localhost", "vercel.app", "unpkg.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unpkg.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig; 