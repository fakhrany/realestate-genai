/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Do not fail the production build on ESLint errors
  eslint: {
    ignoreDuringBuilds: true
  },

  experimental: {
    // Keep loose ESM externals as Next shows in your logs
    esmExternals: 'loose'
  }
};

export default nextConfig;