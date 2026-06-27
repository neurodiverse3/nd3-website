import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';

function getStrapiOrigin(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

function getStrapiRemotePattern(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
    };
  } catch {
    return null;
  }
}

const strapiOrigin = getStrapiOrigin(strapiUrl);
const strapiRemotePattern = getStrapiRemotePattern(strapiUrl);
const cspImageSources = ["'self'", 'data:', 'blob:', 'https://gumroad.com', 'https://*.gumroad.com'];
const cspConnectSources = [
  "'self'",
  'https://api.resend.com',
  'http://127.0.0.1:1337',
  'http://localhost:1337',
  'https://gumroad.com',
  'https://*.gumroad.com',
];

if (strapiOrigin) {
  cspImageSources.push(strapiOrigin);
  cspConnectSources.push(strapiOrigin);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [strapiRemotePattern].filter(Boolean),
  },
  allowedDevOrigins: [
    'lemon-fineness-remark.ngrok-free.dev',
    '*.ngrok-free.dev',
    'localhost:3000',
    '192.168.1.40'
  ],
  async redirects() {
    return [
      {
        source: '/refund-policy',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/refunds',
        destination: '/terms',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/labs/:slug/embed',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://gumroad.com https://assets.gumroad.com;",
              "style-src 'self' 'unsafe-inline' https://assets.gumroad.com https://gumroad.com;",
              `img-src ${cspImageSources.join(' ')};`,
              `connect-src ${cspConnectSources.join(' ')};`,
              "frame-src 'self' https://gumroad.com https://*.gumroad.com;",
              "frame-ancestors *;"
            ].join(' '),
          },
        ],
      },
      {
        source: '/:path((?!labs/[^/]+/embed$).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://gumroad.com https://assets.gumroad.com;", // Needed for Next.js build bundle execution and Gumroad overlay
              "style-src 'self' 'unsafe-inline' https://assets.gumroad.com https://gumroad.com;", // Required for tailwind and Gumroad stylesheets
              `img-src ${cspImageSources.join(' ')};`, // Allow local assets, Gumroad media and Strapi media host
              `connect-src ${cspConnectSources.join(' ')};`, // Allow Strapi, Resend and Gumroad origins
              "frame-src 'self' https://gumroad.com https://*.gumroad.com;", // Allow Gumroad overlays
              "frame-ancestors 'none';"
            ].join(' '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
