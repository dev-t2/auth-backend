import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Auth, User } from 'src/auth/decorators';
import { UsersService } from './users.service';
import {
  ConfirmAuthNumberDto,
  ConfirmEmailDto,
  ConfirmNicknameDto,
  ConfirmPhoneNumberDto,
  CreateUserDto,
  FindEmailDto,
  FindPhoneNumberDto,
  SignInDto,
  UpdatePasswordDto,
} from './users.dto';

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

  @ApiOperation({ summary: '전화번호 중복 확인 및 인증번호 전송' })
  @Post('confirm/phone')
  async confirmPhoneNumber(@Body() { phoneNumber }: ConfirmPhoneNumberDto) {
    return await this.usersService.confirmPhoneNumber(phoneNumber);
  }

  @ApiOperation({ summary: '인증번호 확인' })
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard('sign-token'))
  @Post('confirm/auth')
  async confirmAuthNumber(
    @Auth('authNumber') authNumberByToken: string,
    @Body() { authNumber }: ConfirmAuthNumberDto,
  ) {
    return await this.usersService.confirmAuthNumber(authNumberByToken, authNumber);
  }

  @ApiOperation({ summary: '회원가입' })
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard('phone-token'))
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '전화번호 확인 및 인증번호 전송' })
  @Post('phone')
  async findPhoneNumber(@Body() { phoneNumber }: FindPhoneNumberDto) {
    return await this.usersService.FindPhoneNumber(phoneNumber);
  }

  @ApiOperation({ summary: '이메일 찾기' })
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard('phone-token'))
  @Get('email')
  async findEmail(@Body() findEmailDto: FindEmailDto) {
    return await this.usersService.findEmail(findEmailDto);
  }

  @ApiOperation({ summary: '비밀번호 재설정' })
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard('phone-token'))
  @Put('password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.usersService.updatePassword(updatePasswordDto);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('sign')
  async signIn(@Body() signInDto: SignInDto) {
    return this.usersService.signIn(signInDto);
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard('refresh-token'))
  @Get('access')
  async createAccessToken(@User('id') id: number) {
    return await this.usersService.createAccessToken(id);
  }

  @ApiOperation({ summary: '회원탈퇴' })
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard('access-token'))
  @Put()
  async updateDeletedAt(@User('id') id: number) {
    return this.usersService.updateDeletedAt(id);
  }
}
