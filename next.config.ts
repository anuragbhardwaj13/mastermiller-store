import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // cache Cloudinary images for 30 days
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
