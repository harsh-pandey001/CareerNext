# infrastructure/docker

Container build definitions (activated in **V3**).

- `Dockerfile.api` — multi-stage build for `apps/api` (NestJS).
- `Dockerfile.web` — multi-stage build for `apps/web` (Next.js).

Both build from the **monorepo root** so pnpm workspace packages resolve, and
use `--filter` to install only the target app's dependency graph. The root
`docker-compose.dev.yml` / `docker-compose.stage.yml` reference these files.

Future service images (ai-service, mcp-server) are added here when those apps
are implemented (V6/V7).
