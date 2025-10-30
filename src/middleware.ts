import { randomBytes } from 'crypto';
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function buildCsp(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://trello.com https://*.trello.com https://p.trellocdn.com`,
    `style-src 'self' 'nonce-${nonce}' https://trello.com https://*.trello.com https://p.trellocdn.com`,
    "img-src 'self' data: https://trello.com https://*.trello.com https://p.trellocdn.com",
    "connect-src 'self' https://api.trello.com https://trello.com https://*.trello.com https://api.angorasix.com",
    'frame-ancestors https://trello.com https://*.trello.com',
    'frame-src https://trello.com https://*.trello.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://trello.com https://*.trello.com",
  ].join('; ');
}

export default function middleware(request: NextRequest) {
  const nonce = randomBytes(16).toString('base64');
  const response = intlMiddleware(request);

  response.headers.set('Content-Security-Policy', buildCsp(nonce));
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  response.headers.set('X-Frame-Options', 'ALLOWALL');
  response.headers.set('x-csp-nonce', nonce);
  response.headers.set('x-middleware-override-headers', 'x-csp-nonce');
  response.headers.set('x-middleware-request-x-csp-nonce', nonce);

  return response;
}

export const config = {
  matcher: ['/', '/(es|en)/:path*'],
  runtime: 'nodejs',
};
