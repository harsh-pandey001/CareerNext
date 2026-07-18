# graphql

Client-side GraphQL operations for the web app (GraphQL-first — no REST).

```
graphql/
  <feature>/
    queries.ts       # gql documents
    mutations.ts
    fragments.ts
  codegen.ts         # graphql-codegen config (added with V1 auth)
```

- Operations are authored here as `.graphql`/`gql` documents.
- `graphql-codegen` consumes the API schema and emits typed hooks into
  `@careernext/graphql-types` — clients import those typed hooks, never
  hand-written response types.
