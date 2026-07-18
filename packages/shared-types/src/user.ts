import type { BaseEntity } from './common';

/** Application-level roles. Fine-grained RBAC arrives in V2. */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  isEmailVerified: boolean;
}

/** JWT access-token payload issued by the API. */
export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

/** Access + refresh token pair returned from auth flows. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
