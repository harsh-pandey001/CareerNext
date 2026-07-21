# graphql

Client-side GraphQL operations for the web app (GraphQL-first — no REST).

```
graphql/
  <feature>/
    queries.ts       # gql documents
    mutations.ts
    fragments.ts
```

- Operations are authored here as `gql` documents.
- `packages/graphql-types/codegen.ts` (added with V1 auth) points
  `graphql-codegen` at the API's schema (`apps/api/src/graphql/schema.gql`)
  and these documents, emitting typed hooks into
  `@careernext/graphql-types/src/generated/graphql.ts` — clients import
  those typed hooks, never hand-written response types. Regenerate with
  `pnpm --filter @careernext/graphql-types generate` after changing an
  operation here or the API schema.
