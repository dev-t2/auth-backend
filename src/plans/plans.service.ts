import { Injectable } from '@nestjs/common';

import { CreatePlanDto, UpdatePlanDto } from './plans.dto';

@Injectable()
export class PlansService {
  create(createPlanDto: CreatePlanDto) {
    console.log(createPlanDto);

    return 'This action adds a new plan';
  }

  findAll() {
    return `This action returns all plans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    console.log(updatePlanDto);

    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
