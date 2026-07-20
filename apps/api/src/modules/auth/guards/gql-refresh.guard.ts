import { Injectable, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

import type { GqlContext } from '../../../graphql/gql-context';

/** Protects the refresh mutation with the refresh-token JWT strategy (reads the httpOnly cookie). */
@Injectable()
export class GqlRefreshGuard extends AuthGuard('jwt-refresh') {
  override getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<GqlContext>().req;
  }
}
