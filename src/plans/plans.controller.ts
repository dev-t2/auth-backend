import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParsePositiveIntPipe } from 'src/common/pipes/parse-positive-int.pipe';

import { PlansService } from './plans.service';

@ApiTags('PLAN')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post(':userId')
  async create(@Param('userId', ParsePositiveIntPipe) userId: number) {
    return await this.plansService.create(userId);
  }

  @Get()
  async findAll() {
    return await this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.plansService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(+id);
  }
}
