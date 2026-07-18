import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';

import { configuration } from './config';
import { PrismaModule } from './database/prisma.module';
import { AppResolver } from './app.resolver';

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
      }),
    }),
    PrismaModule,
    // ---- Feature modules (added incrementally per the version roadmap) ----
    // AuthModule,
    // UsersModule,
    // ProfileModule,
    // JobsModule,
    // ApplicationsModule,
    // DocumentsModule,
    // InterviewsModule,     // V2
    // NotificationsModule,  // V2
    // AnalyticsModule,      // V2
  ],
  providers: [AppResolver],
})
export class AppModule {}
