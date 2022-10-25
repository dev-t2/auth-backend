import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

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
}
