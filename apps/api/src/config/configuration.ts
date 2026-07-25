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
});
