# auth module

Authentication — Login, Register, Forgot Password, JWT + Refresh Tokens. (V1)

Structure (added during feature implementation):

```
auth/
  auth.module.ts       # @Module wiring (imported into app.module.ts)
  auth.resolver.ts     # GraphQL code-first resolver (queries/mutations)
  auth.service.ts      # business logic (Clean Architecture: application layer)
  dto/               # input types + class-validator DTOs
  entities/          # GraphQL @ObjectType models
```

Domain types are imported from `@careernext/shared-types` — never redefined here.
