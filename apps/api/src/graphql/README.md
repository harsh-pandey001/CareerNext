# graphql

GraphQL infrastructure for the API (code-first). The schema is generated to
`schema.gql` at build time from resolver decorators — never hand-edited. Shared
scalars, enums registered via `registerEnumType`, and the code-gen source of
truth for `@careernext/graphql-types` live here.
