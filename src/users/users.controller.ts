import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { ConfirmNicknameDto, ConfirmPhoneNumberDto, SignUpDto } from './users.dto';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '닉네임 중복 확인' })
  @Post('confirm/nickname')
  async confirmNickname(@Body() confirmNicknameDto: ConfirmNicknameDto) {
    return await this.usersService.confirmNickname(confirmNicknameDto);
  }

  @ApiOperation({ summary: '전화번호 중복 확인' })
  @Post('confirm/phone-number')
  async confirmPhoneNumber(@Body() confirmPhoneNumberDto: ConfirmPhoneNumberDto) {
    return await this.usersService.confirmPhoneNumber(confirmPhoneNumberDto);
  }

  @ApiOperation({ summary: '회원가입' })
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.usersService.signUp(signUpDto);
  }
}
