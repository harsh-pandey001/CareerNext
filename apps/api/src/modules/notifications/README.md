# notifications module

In-app notifications. (V2)

Structure (added during feature implementation):

```
notifications/
  notifications.module.ts       # @Module wiring (imported into app.module.ts)
  notifications.resolver.ts     # GraphQL code-first resolver (queries/mutations)
  notifications.service.ts      # business logic (Clean Architecture: application layer)
  dto/               # input types + class-validator DTOs
  entities/          # GraphQL @ObjectType models
```

Domain types are imported from `@careernext/shared-types` — never redefined here.
