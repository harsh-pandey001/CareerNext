import { Query, Resolver } from '@nestjs/graphql';

/**
 * Root resolver. A code-first GraphQL schema requires at least one query to
 * build — `health` provides a liveness probe and keeps the schema valid until
 * feature resolvers (auth, jobs, ...) are added.
 */
@Resolver()
export class AppResolver {
  @Query(() => String, { description: 'Liveness probe for the CareerNext API.' })
  health(): string {
    return 'ok';
  }
}
