import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserById(id: number) {
    try {
      return await this.prismaService.user.findUnique({
        where: { id },
        select: { id: true, deletedAt: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { email },
        select: { id: true, password: true, deletedAt: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findUserByNickname(nickname: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { nickname },
        select: { id: true, deletedAt: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { phoneNumber },
        select: { id: true, email: true, deletedAt: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async createUser(
    email: string,
    nickname: string,
    password: string,
    phoneNumber: string,
    isServiceTerms: boolean,
    isPrivacyTerms: boolean,
    isMarketingTerms: boolean,
  ) {
    try {
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
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updatePassword(password: string, phoneNumber: string) {
    try {
      await this.prismaService.user.update({
        where: { phoneNumber },
        data: { password },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateDeletedAt(id: number) {
    try {
      await this.prismaService.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteUser(id: number) {
    try {
      await this.prismaService.user.delete({
        where: { id },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
