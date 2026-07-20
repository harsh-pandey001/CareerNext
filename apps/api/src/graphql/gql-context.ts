import type { Request, Response } from 'express';
import type { User as PrismaUser } from '@prisma/client';

/** Request augmented with the Passport-attached user (set by the auth guards). */
export interface AuthenticatedRequest extends Request {
  user?: PrismaUser;
}

/** GraphQL request context — req/res are exposed for cookie-based auth (see app.module.ts). */
export interface GqlContext {
  req: AuthenticatedRequest;
  res: Response;
}
