import { join } from 'node:path';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import type { GraphQLFormattedError } from 'graphql';

import { configuration } from './config';
import { PrismaModule } from './database/prisma.module';
import { AppResolver } from './app.resolver';
import type { GqlContext } from './graphql/gql-context';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ProfileModule } from './modules/profile/profile.module';
import { InterviewsModule } from './modules/interviews/interviews.module';

const gqlLogger = new Logger('GraphQL');

/**
 * Unhandled resolver errors (raw Prisma failures, programming bugs) surface
 * with code INTERNAL_SERVER_ERROR and their original message — which can
 * carry table/column names or engine internals. Mask the message for those
 * and log the real one server-side; deliberate HttpExceptions (BAD_REQUEST,
 * FORBIDDEN, ...) keep their user-facing messages untouched.
 */
function maskInternalErrors(formattedError: GraphQLFormattedError): GraphQLFormattedError {
  const code = formattedError.extensions?.code;
  if (code !== 'INTERNAL_SERVER_ERROR') return formattedError;

  gqlLogger.error(`Masked internal error on ${formattedError.path?.join('.') ?? '?'}: ${formattedError.message}`);
  return {
    ...formattedError,
    message: 'Something went wrong. Please try again.',
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  };
}

/**
 * Root application module.
 *
 * Wiring order:
 *  - ConfigModule    -> typed env configuration (global)
 *  - PrismaModule    -> database access (global)
 *  - GraphQLModule   -> code-first schema, auto-generated on build
 *
 * Feature modules (auth, users, profile, jobs, applications, interviews,
 * documents, notifications, analytics) are imported here as they are built.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
        sortSchema: true,
        playground: config.get<boolean>('graphql.playground') ?? false,
        // Apollo only suppresses stacktraces when NODE_ENV is exactly
        // "production"/"test" — our staging box runs NODE_ENV=staging, which
        // would leak internal file paths in every error response. Gate on our
        // own env value instead so anything non-development is safe.
        includeStacktraceInErrorResponses: config.get<string>('env') === 'development',
        // Local dev keeps raw errors (they're the debugging surface);
        // everywhere else internal messages are masked.
        formatError: config.get<string>('env') === 'development' ? undefined : maskInternalErrors,
        // Exposes req/res on the GraphQL context so resolvers can read/set
        // the httpOnly refresh-token cookie (auth module).
        context: ({ req, res }: GqlContext): GqlContext => ({ req, res }),
      }),
    }),
    // Rate-limit storage/config. Enforcement is opt-in per resolver via
    // GqlThrottlerGuard (currently the four public auth mutations).
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
    PrismaModule,
    // ---- Feature modules (added incrementally per the version roadmap) ----
    AuthModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
    DocumentsModule,
    ProfileModule,
    InterviewsModule,
    // NotificationsModule,  // V2
    // AnalyticsModule,      // V2
  ],
  providers: [AppResolver],
})
export class AppModule {}
