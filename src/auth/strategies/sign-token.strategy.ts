import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersRepository } from 'src/users/users.repository';

interface IValidate {
  sub: string;
  phoneNumber: string;
  authNumber: string;
}

@Injectable()
export class SignTokenStrategy extends PassportStrategy(Strategy, 'sign-token') {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate({ sub, phoneNumber, authNumber }: IValidate) {
    if (sub !== 'sign') {
      throw new UnauthorizedException();
    }

    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (user) {
      throw new UnauthorizedException();
    }

    return { authNumber };
  }
}
