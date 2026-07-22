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
};

export default nextConfig;
