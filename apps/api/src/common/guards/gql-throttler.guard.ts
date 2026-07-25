import { Injectable, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

import type { GqlContext } from '../../graphql/gql-context';

/**
 * ThrottlerGuard reads req/res off the HTTP execution context, which is
 * undefined inside a GraphQL resolver — this adapter pulls them from the
 * GraphQL context instead. Applied per-resolver (auth mutations), not
 * globally: authenticated traffic is already gated by JWT.
 */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  override getRequestResponse(context: ExecutionContext): { req: GqlContext['req']; res: GqlContext['res'] } {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    return { req: ctx.req, res: ctx.res };
  }
}
