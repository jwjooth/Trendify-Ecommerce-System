/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Custom alias for pages
    config.resolve.alias = {
      ...config.resolve.alias,
      '^pages/': 'src/app/pages/',
    };
    return config;
  },
};

module.exports = nextConfig;
