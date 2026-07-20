import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { User as PrismaUser } from '@prisma/client';

import type { GqlContext } from '../../../graphql/gql-context';

/** Injects the authenticated user (set by GqlAuthGuard) into a resolver param. */
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): PrismaUser => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext<GqlContext>().req.user as PrismaUser;
});
