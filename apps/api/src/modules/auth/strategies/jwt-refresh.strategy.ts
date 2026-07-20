import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { AuthTokenPayload } from '@careernext/shared-types';

import type { AuthenticatedRequest } from '../../../graphql/gql-context';
import { REFRESH_TOKEN_COOKIE } from '../auth.constants';
import type { RefreshTokenPayload } from '../auth.service';

function extractRefreshTokenFromCookie(req: AuthenticatedRequest): string | null {
  return (req?.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined) ?? null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: extractRefreshTokenFromCookie,
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  validate(req: AuthenticatedRequest, payload: AuthTokenPayload): RefreshTokenPayload {
    const rawToken = extractRefreshTokenFromCookie(req);
    if (!rawToken) {
      throw new UnauthorizedException('Missing refresh token.');
    }
    return { sub: payload.sub, rawToken };
  }
}
