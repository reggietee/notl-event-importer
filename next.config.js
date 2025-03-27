/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    WP_API_URL: process.env.WP_API_URL,
  },
  // Ensure we can run Python scripts
  experimental: {
    serverComponentsExternalPackages: ['child_process', 'fs'],
  },
};

module.exports = nextConfig;
