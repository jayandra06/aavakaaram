/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aavakaram.firebasestorage.app',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  env: {
    DHL_API_KEY: process.env.DHL_API_KEY,
    DHL_API_SECRET: process.env.DHL_API_SECRET,
  },
  // Turbopack config for Next.js 16
  turbopack: {
    // Turbopack handles most things automatically
    // Add any Turbopack-specific config here if needed
  },
  // Keep webpack config for production builds (non-Turbopack)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Ignore undici in client-side bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

