import type { NextConfig } from 'next';
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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' https://trello.com https://*.trello.com https://p.trellocdn.com",
              "style-src 'self' 'unsafe-inline' https://trello.com https://*.trello.com https://p.trellocdn.com",
              "img-src 'self' data: https://trello.com https://*.trello.com https://p.trellocdn.com",
              "connect-src 'self' https://api.trello.com https://trello.com https://*.trello.com https://api.angorasix.com",
              'frame-ancestors https://trello.com https://*.trello.com',
              'frame-src https://trello.com https://*.trello.com',
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://trello.com https://*.trello.com",
            ].join('; '),
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
