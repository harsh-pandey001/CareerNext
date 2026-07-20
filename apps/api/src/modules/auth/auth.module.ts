import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  // Secrets/expiry are passed per-call in AuthService (access vs refresh use
  // different secrets), so JwtModule itself needs no default options.
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  providers: [AuthResolver, AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
