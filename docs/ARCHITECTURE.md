# CareerNext — Architecture

This document explains the monorepo scaffold: every folder, the naming
conventions, the shared packages, and how future versions plug in **without
changing the current architecture**. It is the source of truth for the project's
architecture and conventions.

---

## 1. Complete folder structure

```
CareerNext/
├── README.md
├── package.json                  # Root workspace scripts (Turborepo)
├── pnpm-workspace.yaml           # Workspace globs: apps/*, packages/*
├── turbo.json                    # Build/dev/lint/test/typecheck pipelines
├── .npmrc / .nvmrc / .prettierrc.json / .gitignore
├── docker-compose.dev.yml        # Dev: Docker + local PostgreSQL
├── docker-compose.stage.yml      # Staging: AWS EC2 + Nginx
│
├── apps/
│   ├── web/                      # Next.js app        (IMPLEMENTED)
│   ├── api/                      # NestJS API         (IMPLEMENTED)
│   ├── mobile/                   # React Native       (PLACEHOLDER · V5)
│   ├── ai-service/               # FastAPI + AI       (PLACEHOLDER · V6)
│   └── mcp-server/               # MCP server         (PLACEHOLDER · V7)
│
├── packages/
│   ├── shared-ui/                # Reusable MUI React components
│   ├── shared-types/             # Domain types (single source of truth)
│   ├── graphql-types/            # GraphQL Code Generator output
│   ├── utils/                    # Framework-agnostic helpers
│   ├── eslint-config/            # Shared ESLint flat configs
│   └── typescript-config/        # Shared tsconfig presets
│
├── infrastructure/
│   ├── docker/                   # Dockerfile.api / Dockerfile.web (V3)
│   ├── nginx/                    # Reverse-proxy config (V3)
│   ├── terraform/                # IaC: EC2/RDS/S3 (PLACEHOLDER · V3)
│   ├── aws/                      # AWS policies/notes (PLACEHOLDER · V3)
│   ├── scripts/                  # Ops helper scripts
│   └── deployments/              # Env deploy manifests (PLACEHOLDER · V3)
│
├── docs/                         # This document + future ADRs
└── .github/workflows/            # ci.yml · development.yml · staging.yml
```

### apps/web (`src/`)

| Folder        | Purpose                                                             |
| ------------- | ------------------------------------------------------------------ |
| `app`         | Next.js App Router routes, layouts, pages                          |
| `components`  | Web-specific, feature-first React components                       |
| `graphql`     | Client GraphQL operations (queries/mutations/fragments) + codegen  |
| `hooks`       | Shared React hooks                                                 |
| `providers`   | Client provider composition (Apollo, MUI theme, emotion cache)     |
| `layouts`     | Structural page shells (Auth, Dashboard)                           |
| `store`       | Zustand stores (UI/theme, auth) — **no Redux**                     |
| `services`    | Client integrations (Apollo Client factory)                        |
| `config`      | Validated env access                                               |
| `types`       | Web-only view types                                                |
| `constants`   | Routes, query keys, feature flags                                  |
| `utils`       | Web-only helpers                                                   |
| `styles`      | MUI theme (light/dark) and global styles                          |
| `assets`      | Static assets imported by code                                    |
| `middleware`  | Edge/route middleware helpers (auth guards)                        |

### apps/api (`src/`)

| Folder         | Purpose                                                             |
| -------------- | ------------------------------------------------------------------ |
| `modules`      | Feature modules: auth, users, profile, jobs, applications, interviews, documents, notifications, analytics |
| `common`       | Shared building blocks (pagination, base types, exceptions)        |
| `config`       | Typed configuration loaded via `@nestjs/config`                    |
| `database`     | `PrismaService` + global `PrismaModule`                            |
| `graphql`      | GraphQL infra; generated `schema.gql` (code-first)                 |
| `guards`       | Authorization guards (`JwtAuthGuard`, future `RolesGuard`)         |
| `middlewares`  | Request-scoped middleware                                          |
| `decorators`   | Custom decorators (`@CurrentUser()`)                              |
| `interceptors` | Cross-cutting response interceptors                               |
| `filters`      | Global exception filters                                          |
| `utils`        | API-only helpers                                                  |
| `main.ts`      | Bootstrap (validation pipe, CORS, listen)                         |

Each module follows: `*.module.ts` · `*.resolver.ts` · `*.service.ts` · `dto/` ·
`entities/` — a clean split of transport / application / domain layers.

---

## 2. Naming conventions

- **Packages**: scoped `@careernext/<name>` (e.g. `@careernext/shared-types`).
- **Files**: `kebab-case` for modules/services/utilities
  (`apollo-client.ts`, `prisma.service.ts`); `PascalCase.tsx` for React
  components; `*.store.ts` for Zustand stores; `*.resolver.ts` / `*.module.ts`
  for Nest.
- **Types/Interfaces/Enums**: `PascalCase`. **Variables/functions**: `camelCase`.
  **Constants**: `UPPER_SNAKE_CASE`.
- **GraphQL**: types `PascalCase`, fields `camelCase`, enums `UPPER_SNAKE_CASE`.
- **Branches**: `main` (staging) · `develop` (development) · `feature/*`.
- **DB tables**: snake_case via Prisma `@@map` (`users`, `applications`).

---

## 3. Shared packages

The monorepo's core rule: **never duplicate types, GraphQL types, components, or
utilities across apps.** They live once, here:

- **`shared-types`** — domain models (User, Profile, Skill, Job, Application,
  Interview, Document) + common primitives. Imported by web, api, and future
  mobile. Enums include future statuses now (e.g. full `ApplicationStatus`) so
  V2 needs no breaking change.
- **`graphql-types`** — output of GraphQL Code Generator. The API produces the
  schema; web/mobile consume generated typed operations. One generated surface,
  zero hand-written response types.
- **`shared-ui`** — reusable Material UI components consumed by web (and future
  mobile web surfaces).
- **`utils`** — pure, framework-agnostic helpers (dates, strings, pagination).
- **`eslint-config` / `typescript-config`** — one linting + TS standard applied
  everywhere (`base`, `nextjs`, `nestjs`, `react-library` presets), enforcing
  **TypeScript strict mode** across the repo.

---

## 4. GraphQL architecture (GraphQL-first, no REST)

```
apps/api (NestJS, code-first)
   │  resolvers/@ObjectType decorators
   ▼
schema.gql  ── generated at build ──►  graphql-codegen
   │                                        │
   ▼                                        ▼
Apollo Server (/graphql)          @careernext/graphql-types  ──►  web / mobile (Apollo Client)
```

- **API**: code-first. TypeScript classes + decorators are the single source of
  truth; `schema.gql` is generated, never hand-edited.
- **Clients**: Apollo Client only. Operations are authored in `web/src/graphql`,
  and `graphql-codegen` emits typed hooks into `graphql-types`.
- **No REST** unless explicitly required (project rule).
- The health query exists so the schema is valid before feature resolvers land.

---

## 5. Docker architecture (V3)

- **Multi-stage** `Dockerfile.api` / `Dockerfile.web` build from the **repo
  root** so pnpm workspace packages resolve; `--filter` installs only the target
  app's dependency graph → small images.
- **`docker-compose.dev.yml`** — local PostgreSQL (usable today) + optional
  `full` profile for containerized web/api.
- **`docker-compose.stage.yml`** — Nginx reverse proxy fronting web + api;
  PostgreSQL is AWS RDS (not a container) in staging.
- **Nginx** routes `/graphql` → api and everything else → web.

---

## 6. CI/CD architecture

```
GitHub push/PR
   ▼
ci.yml           Lint → Typecheck → Test → Build   (Turborepo, every branch)
   │
develop ─► development.yml ─► build images ─► Development environment   (V3)
main    ─► staging.yml     ─► build images ─► AWS EC2 (staging)         (V3)
```

- `ci.yml` is active now (verification pipeline).
- `development.yml` / `staging.yml` are documented placeholders; the deploy
  steps are enabled in V3 alongside Docker + AWS.
- Turborepo caching keeps CI fast; secrets come from GitHub Actions environments.

---

## 7. Mobile architecture (V5 · placeholder)

`apps/mobile` (React Native) **reuses the existing GraphQL API** and shares
`shared-types`, `graphql-types`, and `utils` — no REST, no duplicate types
(project rule). The `src/` structure (screens, navigation, graphql, hooks,
store, services, components, assets, utils) is scaffolded and empty.

---

## 8. AI architecture (V6 · placeholder)

`apps/ai-service` is a **separate service** (FastAPI + OpenAI/Claude), never
embedded in the API (project rule). It exposes Resume Analysis, Skill
Matching, and Learning/Career Suggestions over the network, keeping the core
architecture untouched.

---

## 9. MCP architecture (V7 · placeholder)

`apps/mcp-server` is a **separate application inside the monorepo** (project
rule). It consumes the GraphQL API and the AI service to power the AI Career
Assistant, job recommendations, and intelligent notifications.

---

## 10. Scalability considerations

1. **Incremental by version** — feature modules and apps are wired in as the
   roadmap (V1→V7) progresses; the skeleton never has to be reshaped.
2. **Single source of truth** — shared packages prevent type/logic drift as
   surfaces multiply (web → mobile → AI → MCP).
3. **Forward-compatible schema** — enums and Prisma models already carry future
   states (full application/interview flow) so V2 is additive, not breaking.
4. **Clean Architecture + SOLID** — transport (resolvers) / application
   (services) / infrastructure (Prisma) are separated and dependency-injected.
5. **Isolated concerns** — AI and MCP are independent services; scaling or
   replacing them never touches web/api.
6. **Cache-friendly builds** — Turborepo pipelines + Docker layer caching keep
   build/test times flat as the repo grows.
7. **Cloud-native path** — Docker → Nginx → AWS EC2/RDS/S3 is pre-wired for
   staging and extends to production without architectural change.
