/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Self-contained production build (just the files actually needed to run,
  // with a minimal node_modules) — keeps the Docker runtime image small
  // instead of shipping the whole monorepo checkout. Docker-only: Vercel
  // produces its own output format and does not want 'standalone'.
  ...(process.env.DOCKER_BUILD === '1' ? { output: 'standalone' } : {}),
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
  // Same-origin GraphQL. On EC2, nginx proxied /graphql -> api:4000, so the
  // browser always called the API from the web app's own origin — which is
  // what lets the httpOnly refresh cookie (sameSite: 'strict') be sent at
  // all. There is no nginx on Vercel, so this rewrite takes its place: the
  // browser still calls <app-origin>/graphql and Vercel proxies it
  // server-side to API_ORIGIN. Without this, login succeeds but every
  // refresh silently fails.
  //
  // Unset API_ORIGIN (local dev) falls back to no rewrite, so the client's
  // NEXT_PUBLIC_GRAPHQL_ENDPOINT keeps pointing straight at localhost:4000.
  async rewrites() {
    if (!process.env.API_ORIGIN) return [];
    return [
      {
        source: '/graphql',
        destination: `${process.env.API_ORIGIN}/graphql`,
      },
    ];
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
