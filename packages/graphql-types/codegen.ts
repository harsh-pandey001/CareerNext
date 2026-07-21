import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * Generates typed Apollo Client hooks from the API's code-first GraphQL
 * schema plus the web app's hand-authored `gql` documents. This is the ONE
 * place GraphQL response/variable types get produced — consumers import the
 * generated hooks/types from here, never hand-write their own (monorepo
 * rule: no duplicate GraphQL types).
 *
 * Regenerate with `pnpm --filter @careernext/graphql-types generate`
 * whenever an operation under `apps/web/src/graphql/**` changes, or the API
 * schema (`apps/api/src/graphql/schema.gql`) changes.
 */
const config: CodegenConfig = {
  schema: '../../apps/api/src/graphql/schema.gql',
  documents: ['../../apps/web/src/graphql/**/*.ts'],
  generates: {
    'src/generated/graphql.ts': {
      // `typescript-operations` already self-includes every enum/input type
      // actually referenced by our documents — adding the bare `typescript`
      // plugin on top duplicates those same declarations in one file.
      plugins: ['typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        // DateTime is serialized as an ISO-8601 string on the wire.
        scalars: { DateTime: 'string' },
      },
    },
  },
};

export default config;
