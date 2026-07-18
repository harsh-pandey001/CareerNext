# documents module

Documents: resume, certificates, offer/experience letters, resume versions. (V1)

Structure (added during feature implementation):

```
documents/
  documents.module.ts       # @Module wiring (imported into app.module.ts)
  documents.resolver.ts     # GraphQL code-first resolver (queries/mutations)
  documents.service.ts      # business logic (Clean Architecture: application layer)
  dto/               # input types + class-validator DTOs
  entities/          # GraphQL @ObjectType models
```

Domain types are imported from `@careernext/shared-types` — never redefined here.
