import { Injectable } from '@nestjs/common';

import { PlansRepository } from './plans.repository';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) {}

  async create(userId: number) {
    return await this.plansRepository.create(userId);
  }

  async findAll() {
    return await this.plansRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  update(id: number) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
