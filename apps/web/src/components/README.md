# components

Web-specific React components, organized **feature-first**:

```
components/
  common/        # small app-wide pieces (Logo, PageHeader, EmptyState)
  <feature>/     # e.g. auth/, dashboard/, jobs/, applications/, profile/
```

- Truly reusable, cross-app components belong in `@careernext/shared-ui`, not here.
- Compose Material UI primitives; do not fork them.
- One component per file, `PascalCase.tsx`, colocated with its styles/tests.
