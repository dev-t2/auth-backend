import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlansRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: number) {
    return await this.prismaService.plan.create({ data: { userId } });
  }

  async findAll() {
    return await this.prismaService.plan.findMany({ where: { user: { deletedAt: null } } });
  }
}
