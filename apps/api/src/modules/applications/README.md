# applications module

Applications: Saved, Applied, Accepted, Rejected (full status flow ships in V2). (V1)

Structure (added during feature implementation):

```
applications/
  applications.module.ts       # @Module wiring (imported into app.module.ts)
  applications.resolver.ts     # GraphQL code-first resolver (queries/mutations)
  applications.service.ts      # business logic (Clean Architecture: application layer)
  dto/               # input types + class-validator DTOs
  entities/          # GraphQL @ObjectType models
```

Domain types are imported from `@careernext/shared-types` — never redefined here.
