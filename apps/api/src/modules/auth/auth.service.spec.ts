import { ConflictException, UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { User as PrismaUser } from '@prisma/client';

import type { PrismaService } from '../../database/prisma.service';
import type { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

const bcryptCompare = jest.mocked(bcrypt.compare as (a: string, b: string) => Promise<boolean>);

const USER: PrismaUser = {
  id: 'user-1',
  email: 'user@example.com',
  passwordHash: 'hashed-password',
  firstName: 'Test',
  lastName: 'User',
  role: 'USER',
  isEmailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

interface Mocks {
  prisma: {
    refreshToken: {
      findUnique: jest.Mock;
      updateMany: jest.Mock;
      update: jest.Mock;
      create: jest.Mock;
    };
    passwordResetToken: { findUnique: jest.Mock; create: jest.Mock };
    user: { update: jest.Mock };
    $transaction: jest.Mock;
  };
  users: { findByEmail: jest.Mock; findById: jest.Mock; create: jest.Mock };
  jwt: { signAsync: jest.Mock; decode: jest.Mock };
  config: { get: jest.Mock };
}

function buildService(): { service: AuthService; mocks: Mocks } {
  const mocks: Mocks = {
    prisma: {
      refreshToken: {
        findUnique: jest.fn(),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        update: jest.fn(),
        create: jest.fn(),
      },
      passwordResetToken: { findUnique: jest.fn(), create: jest.fn() },
      user: { update: jest.fn() },
      $transaction: jest.fn(),
    },
    users: { findByEmail: jest.fn(), findById: jest.fn(), create: jest.fn() },
    jwt: {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
      decode: jest.fn().mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 }),
    },
    config: {
      get: jest.fn((key: string) => {
        const values: Record<string, string | number> = {
          'jwt.accessSecret': 'a',
          'jwt.accessExpiresIn': '15m',
          'jwt.refreshSecret': 'r',
          'jwt.refreshExpiresIn': '7d',
          'auth.resetTokenTtlMin': 30,
          env: 'test',
        };
        return values[key];
      }),
    },
  };

  const service = new AuthService(
    mocks.prisma as unknown as PrismaService,
    mocks.users as unknown as UsersService,
    mocks.jwt as unknown as JwtService,
    mocks.config as unknown as ConfigService,
  );
  return { service, mocks };
}

describe('AuthService', () => {
  describe('register', () => {
    it('normalizes the email (trim + lowercase) before lookup and create', async () => {
      const { service, mocks } = buildService();
      mocks.users.findByEmail.mockResolvedValue(null);
      mocks.users.create.mockResolvedValue(USER);

      await service.register({
        email: '  Foo.Bar@Example.COM ',
        password: 'Password123!',
        firstName: 'Foo',
        lastName: 'Bar',
      });

      expect(mocks.users.findByEmail).toHaveBeenCalledWith('foo.bar@example.com');
      expect(mocks.users.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'foo.bar@example.com' }));
    });

    it('rejects duplicate emails with a ConflictException', async () => {
      const { service, mocks } = buildService();
      mocks.users.findByEmail.mockResolvedValue(USER);

      await expect(
        service.register({ email: USER.email, password: 'x'.repeat(8), firstName: 'A', lastName: 'B' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('login', () => {
    it('uses one uniform message for unknown email and wrong password', async () => {
      const { service, mocks } = buildService();

      mocks.users.findByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'nobody@example.com', password: 'wrong' })).rejects.toThrow(
        'Invalid email or password.',
      );

      mocks.users.findByEmail.mockResolvedValue(USER);
      bcryptCompare.mockResolvedValue(false);
      await expect(service.login({ email: USER.email, password: 'wrong' })).rejects.toThrow(
        'Invalid email or password.',
      );
    });

    it('matches emails case-insensitively', async () => {
      const { service, mocks } = buildService();
      mocks.users.findByEmail.mockResolvedValue(USER);
      bcryptCompare.mockResolvedValue(true);

      await service.login({ email: 'USER@EXAMPLE.COM', password: 'correct' });

      expect(mocks.users.findByEmail).toHaveBeenCalledWith('user@example.com');
    });
  });

  describe('refresh (rotation + reuse detection)', () => {
    const STORED = {
      id: 'token-1',
      userId: USER.id,
      tokenHash: 'irrelevant',
      revokedAt: null,
      expiresAt: new Date(Date.now() + 86_400_000),
    };

    it('revokes the whole session family when a rotated token is replayed after the grace window', async () => {
      const { service, mocks } = buildService();
      mocks.prisma.refreshToken.findUnique.mockResolvedValue({
        ...STORED,
        revokedAt: new Date(Date.now() - 60_000),
      });

      await expect(service.refresh({ sub: USER.id, rawToken: 'stolen' })).rejects.toThrow(
        'Session revoked. Please log in again.',
      );
      expect(mocks.prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: USER.id, revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('treats a replay INSIDE the grace window as a benign concurrent refresh (second tab)', async () => {
      const { service, mocks } = buildService();
      mocks.prisma.refreshToken.findUnique.mockResolvedValue({
        ...STORED,
        revokedAt: new Date(Date.now() - 1000),
      });
      mocks.users.findById.mockResolvedValue(USER);
      mocks.prisma.refreshToken.create.mockResolvedValue({});

      const session = await service.refresh({ sub: USER.id, rawToken: 'concurrent' });

      expect(session.accessToken).toBe('signed-token');
      // No family revocation may have fired.
      expect(mocks.prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });

    it('treats losing the atomic claim to a STALE revocation as reuse', async () => {
      const { service, mocks } = buildService();
      mocks.prisma.refreshToken.findUnique
        .mockResolvedValueOnce(STORED)
        // Re-read after the failed claim: revoked well outside the grace window.
        .mockResolvedValueOnce({ revokedAt: new Date(Date.now() - 60_000) });
      mocks.users.findById.mockResolvedValue(USER);
      // The claim (someone else already took it) -> count 0.
      mocks.prisma.refreshToken.updateMany.mockResolvedValueOnce({ count: 0 });

      await expect(service.refresh({ sub: USER.id, rawToken: 'raced' })).rejects.toThrow(
        'Session revoked. Please log in again.',
      );
      // The follow-up family revocation must have fired too.
      expect(mocks.prisma.refreshToken.updateMany).toHaveBeenCalledTimes(2);
      // And no new session may have been persisted.
      expect(mocks.prisma.refreshToken.create).not.toHaveBeenCalled();
    });

    it('issues a fresh session when the atomic claim is lost to a JUST-NOW rotation', async () => {
      const { service, mocks } = buildService();
      mocks.prisma.refreshToken.findUnique
        .mockResolvedValueOnce(STORED)
        // Re-read after the failed claim: rotated milliseconds ago.
        .mockResolvedValueOnce({ revokedAt: new Date() });
      mocks.users.findById.mockResolvedValue(USER);
      mocks.prisma.refreshToken.updateMany.mockResolvedValueOnce({ count: 0 });
      mocks.prisma.refreshToken.create.mockResolvedValue({});

      const session = await service.refresh({ sub: USER.id, rawToken: 'strict-mode-double-fire' });

      expect(session.accessToken).toBe('signed-token');
      expect(mocks.prisma.refreshToken.updateMany).toHaveBeenCalledTimes(1);
    });

    it('claims the old token before issuing the replacement on the happy path', async () => {
      const { service, mocks } = buildService();
      const order: string[] = [];
      mocks.prisma.refreshToken.findUnique.mockResolvedValue(STORED);
      mocks.users.findById.mockResolvedValue(USER);
      mocks.prisma.refreshToken.updateMany.mockImplementation(() => {
        order.push('claim');
        return Promise.resolve({ count: 1 });
      });
      mocks.prisma.refreshToken.create.mockImplementation(() => {
        order.push('issue');
        return Promise.resolve({});
      });
      mocks.prisma.refreshToken.update.mockResolvedValue({});

      const session = await service.refresh({ sub: USER.id, rawToken: 'valid' });

      expect(order).toEqual(['claim', 'issue']);
      expect(session.accessToken).toBe('signed-token');
    });

    it('rejects tokens bound to a different user', async () => {
      const { service, mocks } = buildService();
      mocks.prisma.refreshToken.findUnique.mockResolvedValue({ ...STORED, userId: 'someone-else' });

      await expect(service.refresh({ sub: USER.id, rawToken: 'foreign' })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects expired tokens', async () => {
      const { service, mocks } = buildService();
      mocks.prisma.refreshToken.findUnique.mockResolvedValue({
        ...STORED,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.refresh({ sub: USER.id, rawToken: 'old' })).rejects.toThrow('Refresh token expired.');
    });
  });

  describe('resetPassword', () => {
    it('rejects unknown, used, and expired tokens with one message', async () => {
      const { service, mocks } = buildService();
      const base = {
        id: 'reset-1',
        userId: USER.id,
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
      };

      mocks.prisma.passwordResetToken.findUnique.mockResolvedValue(null);
      await expect(service.resetPassword({ token: 'x', newPassword: 'NewPassword1!' })).rejects.toThrow(
        'Invalid or expired reset token.',
      );

      mocks.prisma.passwordResetToken.findUnique.mockResolvedValue({ ...base, usedAt: new Date() });
      await expect(service.resetPassword({ token: 'x', newPassword: 'NewPassword1!' })).rejects.toThrow(
        'Invalid or expired reset token.',
      );

      mocks.prisma.passwordResetToken.findUnique.mockResolvedValue({
        ...base,
        expiresAt: new Date(Date.now() - 1000),
      });
      await expect(service.resetPassword({ token: 'x', newPassword: 'NewPassword1!' })).rejects.toThrow(
        'Invalid or expired reset token.',
      );
    });
  });
});
