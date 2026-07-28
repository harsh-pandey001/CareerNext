/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Self-contained production build (just the files actually needed to run,
  // with a minimal node_modules) — keeps the Docker runtime image small
  // instead of shipping the whole monorepo checkout.
  output: 'standalone',
  // Compile shared workspace packages that ship raw TypeScript.
  transpilePackages: [
    '@careernext/shared-ui',
    '@careernext/shared-types',
    '@careernext/graphql-types',
    '@careernext/utils',
  ],
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  // Playwright writes into test-results/ and playwright-report/ on every
  // e2e run, inside this same directory tree. Without this, the dev
  // server's file watcher can pick up those writes as a "source changed"
  // event and trigger a Fast Refresh reload of whatever route is open —
  // seen as the dev server repeatedly re-fetching the current page with no
  // user action. Neither directory affects the app; both are gitignored.
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**', '**/.next/**', '**/test-results/**', '**/playwright-report/**'],
    };
    return config;
  },
};

export default nextConfig;
