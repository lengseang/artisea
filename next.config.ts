import type { NextConfig } from 'next';

const backendApiBaseUrl =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001/api/v1';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/api/v1/:path*',
          destination: `${backendApiBaseUrl}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
