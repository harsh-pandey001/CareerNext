# profile module

Profile: personal details, education, experience, skills, links, languages. (V1)

Structure (added during feature implementation):

```
profile/
  profile.module.ts       # @Module wiring (imported into app.module.ts)
  profile.resolver.ts     # GraphQL code-first resolver (queries/mutations)
  profile.service.ts      # business logic (Clean Architecture: application layer)
  dto/               # input types + class-validator DTOs
  entities/          # GraphQL @ObjectType models
```

Domain types are imported from `@careernext/shared-types` — never redefined here.
