import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';

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
    // InterviewsModule,     // V2
    // NotificationsModule,  // V2
    // AnalyticsModule,      // V2
  ],
  providers: [AppResolver],
})
export class AppModule {}
