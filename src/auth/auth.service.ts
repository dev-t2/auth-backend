import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import axios from 'axios';

import { UsersRepository } from 'src/users/users.repository';
import { SignInDto } from 'src/users/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async sendAuthNumberMessage(phoneNumber: string) {
    const timestamp = Date.now().toString();

    const hmac = crypto.createHmac('sha256', process.env.NAVER_SECRET_KEY);

    const message = `POST /sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages\n${timestamp}\n${process.env.NAVER_ACCESS_KEY}`;

    const signature = hmac.update(message).digest('base64');

    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages`;

    const authNumber = `${Math.floor(Math.random() * 1000000)}`.padStart(6, '0');

    const content = `[SMIL] 인증번호: ${authNumber}\n인증번호를 입력해 주세요.`;

    const data = { type: 'SMS', from: '01041894224', content, messages: [{ to: phoneNumber }] };

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-iam-access-key': process.env.NAVER_ACCESS_KEY,
      'x-ncp-apigw-signature-v2': signature,
    };

    try {
      await axios.post(url, data, { headers });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

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
        { sub: 'access', id: user.id },
        { secret: process.env.JWT_SECRET_KEY, expiresIn: '5m' },
      ),
      refreshToken: this.jwtService.sign(
        { sub: 'refresh', id: user.id },
        { secret: process.env.JWT_SECRET_KEY },
      ),
    };
  }

  async createAccessToken(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: this.jwtService.sign(
        { sub: 'access', id: user.id },
        { secret: process.env.JWT_SECRET_KEY, expiresIn: '5m' },
      ),
    };
  }
}
