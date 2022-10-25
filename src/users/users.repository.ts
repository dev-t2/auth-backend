import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './users.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByNickname(nickname: string) {
    return await this.prismaService.user.findUnique({
      where: { nickname },
      select: { id: true },
    });
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    return await this.prismaService.user.findUnique({
      where: { phoneNumber },
      select: { id: true },
    });
  }

  async createUser({
    email,
    nickname,
    password,
    phoneNumber,
    isServiceTerms,
    isPrivacyTerms,
    isMarketingTerms,
  }: SignUpDto) {
    return await this.prismaService.user.create({
      data: {
        email,
        nickname,
        password,
        phoneNumber,
        isServiceTerms,
        isPrivacyTerms,
        isMarketingTerms,
      },
    });
  }
}
