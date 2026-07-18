# CareerNext

> Your Next Career Move Starts Here.

CareerNext is a **Career Management, Companion, Analytics & Growth Platform** —
not a job portal, ATS, or interview tracker. This repository is a production-ready
**pnpm + Turborepo monorepo**.

## Stack

| Layer     | Technology                                                                 |
| --------- | -------------------------------------------------------------------------- |
| Web       | Next.js, TypeScript, Material UI, Apollo Client, Zustand, React Hook Form, Zod |
| API       | NestJS, GraphQL (code-first), Prisma, PostgreSQL, JWT + Refresh Tokens      |
| Shared    | shared-types, graphql-types, shared-ui, utils, eslint-config, typescript-config |
| DevOps    | Docker, Docker Compose, Nginx, GitHub Actions                              |
| Cloud     | AWS EC2 / S3 / RDS                                                          |

## Layout

```
CareerNext/
  apps/            web · api · mobile* · ai-service* · mcp-server*   (* future placeholders)
  packages/        shared-ui · shared-types · graphql-types · utils · eslint-config · typescript-config
  infrastructure/  docker · nginx · terraform · aws · scripts · deployments
  docs/            architecture & conventions
  .github/         CI/CD workflows
```

## Getting started

> Requires Node ≥ 20 and pnpm ≥ 9 (`corepack enable`).

```bash
pnpm install                                             # install the whole workspace
docker compose -f docker-compose.dev.yml up -d postgres  # local PostgreSQL
pnpm --filter @careernext/api prisma:generate            # generate Prisma client
pnpm dev                                                 # run all apps (Turborepo)
```

- Web: http://localhost:3000
- API / GraphQL: http://localhost:4000/graphql

## Scripts (root, Turborepo)

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Run all apps in watch mode         |
| `pnpm build`     | Build all apps & packages          |
| `pnpm lint`      | Lint the workspace                 |
| `pnpm test`      | Run all tests                      |
| `pnpm typecheck` | Type-check the workspace           |
| `pnpm format`    | Prettier format                    |

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full architecture,
folder-by-folder explanations, conventions, and the version roadmap.
