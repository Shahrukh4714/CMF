const BUILD_ID = Date.now().toString();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix WebWorker blob: URL loading — prevents 'Cannot find module blob:...' error
      // that occurs when Webpack tries to treat blob: worker URLs as module imports
      config.output.globalObject = 'self';
    } else {
      config.externals.push("pdf-parse");
    }
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  generateEtags: true,
  async headers() {
    const telemetryUrl = process.env.NEXT_PUBLIC_TELEMETRY_URL;
    let telemetryOrigin = "";
    if (telemetryUrl) {
      try {
        telemetryOrigin = " " + new URL(telemetryUrl).origin;
      } catch {}
    }

    const baseCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://apis.google.com https://www.dropbox.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      `connect-src 'self' https://*.googleapis.com https://*.dropboxapi.com https://cdn.jsdelivr.net https://tessdata.projectnaptha.com${telemetryOrigin}`,
      "frame-src 'self' https://*.google.com https://*.dropbox.com",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    const converterCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' wasm-unsafe-eval https://apis.google.com https://www.dropbox.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      `connect-src 'self' https://*.googleapis.com https://*.dropboxapi.com https://cdn.jsdelivr.net https://tessdata.projectnaptha.com${telemetryOrigin}`,
      "frame-src 'self' https://*.google.com https://*.dropbox.com",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    const getSecurityHeaders = (csp) => [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
    ];

    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|eot)',
        locale: false,
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        source: '/convert/:path*',
        headers: [
          ...getSecurityHeaders(converterCsp),
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
          { key: 'X-Robots-Tag', value: 'index, follow' },
        ],
      },
      {
        source: '/',
        headers: [
          ...getSecurityHeaders(converterCsp),
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },
      {
        source: '/tools/:path*',
        headers: [
          ...getSecurityHeaders(baseCsp),
          { key: 'X-Robots-Tag', value: 'index, follow' },
        ],
      },
      {
        source: '/format/:path*',
        headers: getSecurityHeaders(baseCsp),
      },
      {
        source: '/formats',
        headers: getSecurityHeaders(baseCsp),
      },
      {
        source: '/about',
        headers: getSecurityHeaders(baseCsp),
      },
      {
        source: '/privacy',
        headers: getSecurityHeaders(baseCsp),
      },
      {
        source: '/tools',
        headers: getSecurityHeaders(baseCsp),
      },
      {
        source: '/blog',
        headers: getSecurityHeaders(baseCsp),
      },
      {
        source: '/blog/:path*',
        headers: getSecurityHeaders(baseCsp),
      },
    ];
  },
};

module.exports = nextConfig;
