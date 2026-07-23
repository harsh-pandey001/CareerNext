import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { CookieOptions, Response } from 'express';

import type { GqlContext } from '../../graphql/gql-context';
import { AuthService, type IssuedSession, type RefreshTokenPayload } from './auth.service';
import { REFRESH_TOKEN_COOKIE } from './auth.constants';
import { CurrentUser } from './decorators/current-user.decorator';
// NOTE: these DTOs must stay value imports (not `import type`) — @nestjs/graphql's
// @Args() decorator infers the GraphQL input type via emitted `design:paramtypes`
// reflection metadata, which needs the real class reference at runtime.
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GqlRefreshGuard } from './guards/gql-refresh.guard';
import { AuthPayloadModel } from './models/auth-payload.model';
import { toUserModel, UserModel } from './models/user.model';
import type { User as PrismaUser } from '@prisma/client';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => AuthPayloadModel)
  async register(
    @Args('input') input: RegisterInput,
    @Context() context: GqlContext,
  ): Promise<AuthPayloadModel> {
    const session = await this.authService.register(input);
    this.setRefreshCookie(context.res, session);
    return { accessToken: session.accessToken, user: toUserModel(session.user) };
  }

  @Mutation(() => AuthPayloadModel)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: GqlContext,
  ): Promise<AuthPayloadModel> {
    const session = await this.authService.login(input);
    this.setRefreshCookie(context.res, session);
    return { accessToken: session.accessToken, user: toUserModel(session.user) };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlRefreshGuard)
  async logout(@Context() context: GqlContext): Promise<boolean> {
    // Gated on the refresh cookie (7d), not the access token (15m) like most
    // other guarded mutations — logout ends the refresh session, so it must
    // still work once the short-lived access token has quietly expired.
    // Using GqlAuthGuard here was the actual bug: if it expired while the
    // user was idle on a page, logout would 401 before ever reaching the
    // resolver, the cookie would never get cleared, and the client's
    // post-logout redirect to /login would just get bounced straight back
    // by middleware, which still saw a (still valid) session cookie.
    const payload = context.req.user as unknown as RefreshTokenPayload;
    const result = await this.authService.logout(payload.sub, payload.rawToken);
    this.clearRefreshCookie(context.res);
    return result;
  }

  @Mutation(() => AuthPayloadModel)
  @UseGuards(GqlRefreshGuard)
  async refreshToken(@Context() context: GqlContext): Promise<AuthPayloadModel> {
    const payload = context.req.user as unknown as RefreshTokenPayload;
    const session = await this.authService.refresh(payload);
    this.setRefreshCookie(context.res, session);
    return { accessToken: session.accessToken, user: toUserModel(session.user) };
  }

  @Mutation(() => Boolean)
  forgotPassword(@Args('input') input: ForgotPasswordInput): Promise<boolean> {
    return this.authService.forgotPassword(input.email);
  }

  @Mutation(() => Boolean)
  resetPassword(@Args('input') input: ResetPasswordInput): Promise<boolean> {
    return this.authService.resetPassword(input);
  }

  @Query(() => UserModel)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: PrismaUser): UserModel {
    return toUserModel(user);
  }

  private setRefreshCookie(res: Response, session: IssuedSession): void {
    res.cookie(REFRESH_TOKEN_COOKIE, session.refreshToken, {
      ...this.baseCookieOptions(),
      expires: session.refreshTokenExpiresAt,
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_TOKEN_COOKIE, this.baseCookieOptions());
  }

  private baseCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.configService.get<string>('env') === 'production',
      sameSite: 'strict',
      domain: this.configService.get<string>('auth.cookieDomain'),
      path: '/',
    };
  }
}
