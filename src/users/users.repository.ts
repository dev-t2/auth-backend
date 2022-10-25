import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create() {
    return await this.prismaService.user.create({ data: {} });
  }

  async delete(id: number) {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
