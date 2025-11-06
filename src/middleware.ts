import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function buildCsp(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://trello.com https://*.trello.com https://p.trellocdn.com`,
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://trello.com https://*.trello.com https://p.trellocdn.com`,
    "img-src 'self' data: https://trello.com https://*.trello.com https://p.trellocdn.com",
    "connect-src 'self' https://api.trello.com https://trello.com https://*.trello.com https://p.trellocdn.com https://api.angorasix.com",
    'frame-ancestors https://trello.com https://*.trello.com',
    'frame-src https://trello.com https://*.trello.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://trello.com https://*.trello.com",
  ].join('; ');
}

const base64Chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function encodeBase64(bytes: Uint8Array) {
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const byte1 = bytes[i] ?? 0;
    const byte2 = bytes[i + 1] ?? 0;
    const byte3 = bytes[i + 2] ?? 0;

    const enc1 = byte1 >> 2;
    const enc2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
    const enc3 = ((byte2 & 0x0f) << 2) | (byte3 >> 6);
    const enc4 = byte3 & 0x3f;

    if (i + 1 >= bytes.length) {
      result += base64Chars[enc1] + base64Chars[enc2] + '==';
    } else if (i + 2 >= bytes.length) {
      result += base64Chars[enc1] + base64Chars[enc2] + base64Chars[enc3] + '=';
    } else {
      result +=
        base64Chars[enc1] +
        base64Chars[enc2] +
        base64Chars[enc3] +
        base64Chars[enc4];
    }
  }
  return result;
}

function generateNonce() {
  const array = new Uint8Array(16);
  const webCrypto = globalThis.crypto;

  if (!webCrypto || typeof webCrypto.getRandomValues !== 'function') {
    throw new Error('Secure crypto.getRandomValues() is unavailable');
  }

  webCrypto.getRandomValues(array);
  return encodeBase64(array);
}

export default function middleware(request: NextRequest) {
  const nonce = generateNonce();
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
