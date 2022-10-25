import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { ParsePositiveIntPipe } from 'src/common/pipes/parse-positive-int.pipe';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create() {
    return await this.usersService.create();
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.usersService.update(+id);
  }

  @Delete(':id')
  async delete(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.usersService.delete(id);
  }
}
