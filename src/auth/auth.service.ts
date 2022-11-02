import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { UsersRepository } from 'src/users/users.repository';

interface ICacheData {
  authNumber: string;
  numberOfRequest: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly httpService: HttpService,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createAuthMessage(phoneNumber: string) {
    const cachedData = await this.cache.get<ICacheData>(phoneNumber);

    if (cachedData && cachedData.numberOfRequest >= 5) {
      throw new UnauthorizedException();
    }

    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages`;

    const authNumber = `${Math.floor(Math.random() * 1000000)}`.padStart(6, '0');
    const content = `인증번호: ${authNumber}\n인증번호를 입력해 주세요.`;
    const data = {
      type: 'SMS',
      from: process.env.NAVER_PHONE_NUMBER,
      content,
      messages: [{ to: phoneNumber }],
    };

    const timestamp = Date.now().toString();

    const hmac = crypto.createHmac('sha256', process.env.NAVER_SECRET_KEY);
    const message = `POST /sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages\n${timestamp}\n${process.env.NAVER_ACCESS_KEY}`;
    const signature = hmac.update(message).digest('base64');

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-iam-access-key': process.env.NAVER_ACCESS_KEY,
      'x-ncp-apigw-signature-v2': signature,
    };

    try {
      await this.httpService.axiosRef.post(url, data, { headers });

      await this.cache.set(phoneNumber, {
        authNumber,
        count: (cachedData?.numberOfRequest ?? 0) + 1,
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async confirmAuth(phoneNumber: string, authNumber: string) {
    const cachedData = await this.cache.get<ICacheData>(phoneNumber);

    if (authNumber !== cachedData?.authNumber) {
      throw new BadRequestException();
    }

    await this.cache.del(phoneNumber);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException();
    }

    const isValidatedPassword = await bcrypt.compare(password, user.password);

    if (!isValidatedPassword) {
      throw new UnauthorizedException();
    }

    const { id } = await this.usersRepository.updateUpdatedAt(user.id);

    const secret = process.env.JWT_SECRET_KEY;

    return {
      accessToken: this.jwtService.sign({ sub: 'access', id }, { secret, expiresIn: '5m' }),
      refreshToken: this.jwtService.sign({ sub: 'refresh', id }, { secret }),
    };
  }

  async createAccessToken(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException();
    }

    await this.usersRepository.updateUpdatedAt(id);

    const secret = process.env.JWT_SECRET_KEY;

    return {
      accessToken: this.jwtService.sign({ sub: 'access', id }, { secret, expiresIn: '5m' }),
    };
  }
}
