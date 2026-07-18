/**
 * Centralized, validated access to public environment variables.
 * Never read `process.env` directly outside this module.
 */
export const env = {
  graphqlEndpoint:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? 'http://localhost:4000/graphql',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'CareerNext',
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
} as const;
