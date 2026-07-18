/**
 * @careernext/shared-types
 *
 * Single source of truth for domain types shared across every CareerNext
 * application (web, api, mobile, ai-service, mcp-server).
 *
 * RULE: Never duplicate these interfaces inside an application. Import from
 * `@careernext/shared-types` instead (monorepo rule: no duplicate types).
 */
export * from './common';
export * from './user';
export * from './profile';
export * from './skill';
export * from './job';
export * from './application';
export * from './interview';
export * from './document';
