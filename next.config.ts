import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ];
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true, // TODO re-enable this
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. // TODO re-enable this later
    ignoreDuringBuilds: true,
  },
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...(config.resolve.alias || {}),
  //     react: require.resolve('react'),
  //   };
  //   return config;
  // },
};

export default withNextIntl(nextConfig);
