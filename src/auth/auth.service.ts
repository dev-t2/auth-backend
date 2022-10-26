import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { UsersRepository } from 'src/users/users.repository';
import { SignInDto } from 'src/users/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async signIn({ email, password }: SignInDto) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValidatedPassword = await bcrypt.compare(password, user.password);

    if (!isValidatedPassword) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: this.jwtService.sign(
        { sub: user.id },
        { secret: process.env.ACCESS_TOKEN_SECRET_KEY, expiresIn: '5m' },
      ),
      refreshToken: this.jwtService.sign(
        { sub: user.id },
        { secret: process.env.REFRESH_TOKEN_SECRET_KEY, expiresIn: '10m' },
      ),
    };
  }
}
