import { Controller, Get, Param } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('confirm/nickname/:nickname')
  async confirmNickname(@Param('nickname') nickname: string) {
    return await this.usersService.confirmNickname(nickname);
  }
}
