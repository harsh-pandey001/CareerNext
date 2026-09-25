/**
 * Typed application configuration, loaded once at bootstrap via @nestjs/config.
 * Consumers inject ConfigService and read these namespaced values.
 */
export interface AppConfig {
  env: string;
  port: number;
  jwt: {
    accessSecret: string;
    accessExpiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  graphql: {
    playground: boolean;
  };
  webOrigin: string;
  auth: {
    cookieDomain?: string;
    resetTokenTtlMin: number;
  };
  storage: {
    accountId?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucket?: string;
    /** Lifetime of the presigned download URLs handed to the browser. */
    signedUrlTtlSec: number;
  };
}

const env = (): string => process.env.NODE_ENV ?? 'development';

/**
 * Dev gets a convenience fallback; everywhere else a missing secret is a
 * hard boot failure — silently signing tokens with a known default string
 * would let anyone forge a session.
 */
function requiredSecret(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value) return value;
  if (env() === 'development') return devFallback;
  throw new Error(`${name} must be set when NODE_ENV is not "development".`);
}

export default (): AppConfig => ({
  env: env(),
  port: parseInt(process.env.PORT ?? '4000', 10),
  jwt: {
    accessSecret: requiredSecret('JWT_ACCESS_SECRET', 'change-me-access-secret'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshSecret: requiredSecret('JWT_REFRESH_SECRET', 'change-me-refresh-secret'),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  graphql: {
    playground: process.env.GRAPHQL_PLAYGROUND === 'true',
  },
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
  auth: {
    cookieDomain: process.env.COOKIE_DOMAIN,
    resetTokenTtlMin: parseInt(process.env.RESET_TOKEN_TTL_MIN ?? '30', 10),
  },
  // Cloudflare R2 (S3-compatible). Deliberately NOT validated at boot like
  // the JWT secrets: the API is deployed before the bucket exists, and an
  // instance with no document traffic is perfectly healthy without it.
  // StorageService fails loudly at call time instead — see assertConfigured.
  storage: {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET,
    signedUrlTtlSec: parseInt(process.env.R2_SIGNED_URL_TTL_SEC ?? '300', 10),
  },
});
