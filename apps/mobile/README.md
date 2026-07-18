# apps/mobile — PLACEHOLDER (V5)

React Native mobile application. **Not implemented yet** — this is a scalable
placeholder so the architecture is ready without future changes.

Planned (V5): Mobile Application, Push Notifications, Mobile Authentication.

Key principle: the mobile app **reuses the existing GraphQL API** (`apps/api`)
and shares `@careernext/shared-types`,
`@careernext/graphql-types`, and `@careernext/utils`. No REST, no duplicate types.

Folder structure (scaffolded):

```
src/
  screens/       navigation/    graphql/    hooks/
  components/    store/         services/   assets/    utils/
```
