/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
