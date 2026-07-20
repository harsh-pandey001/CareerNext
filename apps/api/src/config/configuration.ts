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

export default (): AppConfig => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000', 10),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change-me-access-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh-secret',
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
