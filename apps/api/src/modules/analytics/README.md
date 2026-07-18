# analytics module

Career analytics and dashboard statistics. (V2)

Structure (added during feature implementation):

```
analytics/
  analytics.module.ts       # @Module wiring (imported into app.module.ts)
  analytics.resolver.ts     # GraphQL code-first resolver (queries/mutations)
  analytics.service.ts      # business logic (Clean Architecture: application layer)
  dto/               # input types + class-validator DTOs
  entities/          # GraphQL @ObjectType models
```

Domain types are imported from `@careernext/shared-types` — never redefined here.
