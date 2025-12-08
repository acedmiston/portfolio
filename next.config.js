/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 90, 100],
  },
  webpack: (config, { isServer }) => {
    // Ignore the messages/pre directory during build if it doesn't exist
    // This prevents build errors when pre files are not present
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
