import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { ConfirmEmailDto, ConfirmNicknameDto, ConfirmPhoneNumberDto, SignUpDto } from './users.dto';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '이메일 중복 확인' })
  @Post('confirm/email')
  async confirmEmail(@Body() { email }: ConfirmEmailDto) {
    return await this.usersService.confirmEmail(email);
  }

  @ApiOperation({ summary: '닉네임 중복 확인' })
  @Post('confirm/nickname')
  async confirmNickname(@Body() { nickname }: ConfirmNicknameDto) {
    return await this.usersService.confirmNickname(nickname);
  }

  @ApiOperation({ summary: '전화번호 중복 확인' })
  @Post('confirm/phoneNumber')
  async confirmPhoneNumber(@Body() { phoneNumber }: ConfirmPhoneNumberDto) {
    return await this.usersService.confirmPhoneNumber(phoneNumber);
  }

  @ApiOperation({ summary: '회원가입' })
  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.usersService.signUp(signUpDto);
  }
}
