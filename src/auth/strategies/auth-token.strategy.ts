import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersRepository } from 'src/users/users.repository';

interface IValidate {
  sub: string;
  authNumber: string;
}

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(Strategy, 'auth-token') {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate({ sub, authNumber }: IValidate) {
    const user = await this.usersRepository.findUserByPhoneNumber(sub);

    if (user) {
      throw new UnauthorizedException();
    }

    return { authNumber };
  }
}
