import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, AuthTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [PassportModule, JwtModule, forwardRef(() => UsersModule)],
  providers: [AuthService, AuthTokenStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
