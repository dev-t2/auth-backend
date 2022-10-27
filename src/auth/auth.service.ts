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

    if (!user || user.deletedAt) {
      throw new UnauthorizedException();
    }

    const isValidatedPassword = await bcrypt.compare(password, user.password);

    if (!isValidatedPassword) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: this.jwtService.sign(
        { sub: user.id },
        { secret: process.env.ACCESS_SECRET_KEY, expiresIn: '60s' },
      ),
      refreshToken: this.jwtService.sign(
        { sub: user.id },
        { secret: process.env.REFRESH_SECRET_KEY },
      ),
    };
  }

  async refreshToken(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: this.jwtService.sign(
        { sub: user.id },
        { secret: process.env.ACCESS_SECRET_KEY, expiresIn: '60s' },
      ),
    };
  }
}
