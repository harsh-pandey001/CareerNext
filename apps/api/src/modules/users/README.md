# users module

User account management and lookups used by auth/profile. (V1)

Structure (added during feature implementation):

```
users/
  users.module.ts       # @Module wiring (imported into app.module.ts)
  users.resolver.ts     # GraphQL code-first resolver (queries/mutations)
  users.service.ts      # business logic (Clean Architecture: application layer)
  dto/               # input types + class-validator DTOs
  entities/          # GraphQL @ObjectType models
```

Domain types are imported from `@careernext/shared-types` — never redefined here.
