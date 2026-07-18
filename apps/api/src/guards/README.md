# guards

Authorization guards (NestJS `CanActivate`). V1 ships `JwtAuthGuard` (access-token
verification). Role-based `RolesGuard` arrives in V2 with RBAC. Guards protect
GraphQL resolvers via `@UseGuards(...)`.
