import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kolscan.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.kolscan.io',
        port: '',
        pathname: '/profiles/**',
      },
    ],
  },
};

export default nextConfig;
