# jobs module

Jobs: dummy jobs, save, apply, external links, search, filters. (V1)

Structure (added during feature implementation):

```
jobs/
  jobs.module.ts       # @Module wiring (imported into app.module.ts)
  jobs.resolver.ts     # GraphQL code-first resolver (queries/mutations)
  jobs.service.ts      # business logic (Clean Architecture: application layer)
  dto/               # input types + class-validator DTOs
  entities/          # GraphQL @ObjectType models
```

Domain types are imported from `@careernext/shared-types` — never redefined here.
