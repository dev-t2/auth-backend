import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface IValidate {
  sub: string;
}

@Injectable()
export class PhoneTokenStrategy extends PassportStrategy(Strategy, 'phone-token') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate({ sub }: IValidate) {
    if (sub !== 'phone') {
      throw new UnauthorizedException();
    }

    return {};
  }
}
