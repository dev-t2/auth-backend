import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { ConfirmNicknameDto, ConfirmPhoneNumberDto } from './users.dto';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('confirm/nickname')
  async confirmNickname(@Body() confirmNicknameDto: ConfirmNicknameDto) {
    return await this.usersService.confirmNickname(confirmNicknameDto);
  }

  @Post('confirm/phone-number')
  async confirmPhoneNumber(@Body() confirmPhoneNumberDto: ConfirmPhoneNumberDto) {
    return await this.usersService.confirmPhoneNumber(confirmPhoneNumberDto);
  }
}
