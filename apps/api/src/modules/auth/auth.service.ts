import { createHash, randomBytes, randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { User as PrismaUser } from '@prisma/client';
import type { AuthTokenPayload, UserRole } from '@careernext/shared-types';

// NOTE: PrismaService/UsersService/ConfigService/JwtService must stay as
// value imports (not `import type`) — NestJS DI resolves constructor
// params via emitted `design:paramtypes` reflection metadata, which needs
// the real class reference at runtime, not just its type.
import { PrismaService } from '../../database/prisma.service';
import { UsersService } from '../users/users.service';
import type { RegisterInput } from './dto/register.input';
import type { LoginInput } from './dto/login.input';
import type { ResetPasswordInput } from './dto/reset-password.input';

const BCRYPT_ROUNDS = 12;

/** Emails are stored and matched lowercase — `Foo@x.com` and `foo@x.com` are one account. */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export interface IssuedSession {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  user: PrismaUser;
}

export interface RefreshTokenPayload {
  sub: string;
  rawToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(input: RegisterInput): Promise<IssuedSession> {
    const email = normalizeEmail(input.email);
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await this.usersService.create({
      email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    return this.issueSession(user);
  }

  async login(input: LoginInput): Promise<IssuedSession> {
    const user = await this.usersService.findByEmail(normalizeEmail(input.email));
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.issueSession(user);
  }

  async logout(userId: string, rawRefreshToken: string | undefined): Promise<boolean> {
    if (rawRefreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, tokenHash: this.hashToken(rawRefreshToken), revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return true;
  }

  async refresh(payload: RefreshTokenPayload): Promise<IssuedSession> {
    const tokenHash = this.hashToken(payload.rawToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    if (stored.revokedAt) {
      // This exact token was already rotated away once — presenting it again
      // means it was stolen/replayed. Revoke the entire session family.
      await this.prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Session revoked. Please log in again.');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired.');
    }

    const user = await this.usersService.findById(stored.userId);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Atomically claim the token BEFORE issuing a replacement. Two concurrent
    // requests presenting the same token (victim + attacker replay) both pass
    // the read above under READ COMMITTED — but only one can win this
    // conditional update. The loser gets count 0 and is treated as reuse,
    // which also revokes the whole session family. Claiming first also means
    // a crash mid-rotation leaves zero live tokens (re-login), never two.
    const claimed = await this.prisma.refreshToken.updateMany({
      where: { id: stored.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (claimed.count === 0) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Session revoked. Please log in again.');
    }

    const session = await this.issueSession(user);

    // Audit link only — the old token is already revoked by the claim above.
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { replacedByTokenHash: this.hashToken(session.refreshToken) },
    });

    return session;
  }

  /** Always returns true — never reveals whether the email exists (anti-enumeration). */
  async forgotPassword(rawEmail: string): Promise<boolean> {
    const email = normalizeEmail(rawEmail);
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const rawToken = randomBytes(32).toString('hex');
      const ttlMin = this.configService.get<number>('auth.resetTokenTtlMin') ?? 30;

      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: this.hashToken(rawToken),
          expiresAt: new Date(Date.now() + ttlMin * 60_000),
        },
      });

      // V1: no email service yet (that's V4/BullMQ). Surface the token in
      // LOCAL DEV logs only so the reset UI can be exercised end to end —
      // staging/production logs must never carry live reset tokens.
      if (this.configService.get<string>('env') === 'development') {
        this.logger.log(`Password reset token for ${email}: ${rawToken}`);
      }
    }

    return true;
  }

  async resetPassword(input: ResetPasswordInput): Promise<boolean> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: this.hashToken(input.token) },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      this.prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return true;
  }

  private async issueSession(user: PrismaUser): Promise<IssuedSession> {
    const payload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as unknown as UserRole,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
    });

    // jti makes every refresh token unique. Without it, two sessions issued
    // for the same user within the same second (double-click login, or
    // register immediately followed by login) sign byte-identical JWTs —
    // same payload, same second-precision iat/exp — and the second
    // `refreshToken.create` dies on the unique tokenHash constraint.
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, jti: randomUUID() },
      {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      },
    );

    const { exp } = this.jwtService.decode(refreshToken) as { exp: number };
    const refreshTokenExpiresAt = new Date(exp * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return { accessToken, refreshToken, refreshTokenExpiresAt, user };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
