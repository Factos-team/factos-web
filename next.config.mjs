// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL + '/:path*',  // 예: 'http://your-http-api.com'
      },
    ];
  },
};

export default nextConfig;