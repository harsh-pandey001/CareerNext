import { Injectable, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

import type { GqlContext } from '../../../graphql/gql-context';

/** Protects a resolver with the access-token JWT strategy. */
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt-access') {
  override getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<GqlContext>().req;
  }
}
