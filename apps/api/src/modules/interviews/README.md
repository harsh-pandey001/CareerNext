# interviews module

Interview Tracker and round management. (V2)

Structure (added during feature implementation):

```
interviews/
  interviews.module.ts       # @Module wiring (imported into app.module.ts)
  interviews.resolver.ts     # GraphQL code-first resolver (queries/mutations)
  interviews.service.ts      # business logic (Clean Architecture: application layer)
  dto/               # input types + class-validator DTOs
  entities/          # GraphQL @ObjectType models
```

Domain types are imported from `@careernext/shared-types` — never redefined here.
