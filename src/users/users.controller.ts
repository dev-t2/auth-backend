import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'src/auth/decorators';
import { UsersService } from './users.service';
import {
  ConfirmAuthNumberDto,
  ConfirmEmailDto,
  ConfirmNicknameDto,
  ConfirmPhoneNumberDto,
  CreateAuthNumberDto,
  CreateUserDto,
  FindEmailDto,
  SignInDto,
  UpdatePasswordDto,
} from './users.dto';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '이메일 중복 확인' })
  @Post('email')
  async confirmEmail(@Body() { email }: ConfirmEmailDto) {
    return await this.usersService.confirmEmail(email);
  }

  @ApiOperation({ summary: '닉네임 중복 확인' })
  @Post('nickname')
  async confirmNickname(@Body() { nickname }: ConfirmNicknameDto) {
    return await this.usersService.confirmNickname(nickname);
  }

  @ApiOperation({ summary: '전화번호 확인' })
  @Post('phone')
  async confirmPhoneNumber(
    @Query('isDup') isDup: boolean,
    @Body() { phoneNumber }: ConfirmPhoneNumberDto,
  ) {
    return await this.usersService.confirmPhoneNumber(isDup, phoneNumber);
  }

  @ApiOperation({ summary: '인증번호 전송' })
  @Post('auth')
  async createAuthNumber(@Body() { phoneNumber }: CreateAuthNumberDto) {
    return await this.usersService.createAuthNumber(phoneNumber);
  }

  @ApiOperation({ summary: '인증번호 확인' })
  @Put('auth')
  async confirmAuthNumber(@Body() { phoneNumber, authNumber }: ConfirmAuthNumberDto) {
    return await this.usersService.confirmAuthNumber(phoneNumber, authNumber);
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '이메일 찾기' })
  @Put('email')
  async findEmail(@Body() findEmailDto: FindEmailDto) {
    return await this.usersService.findEmail(findEmailDto);
  }

  @ApiOperation({ summary: '비밀번호 재설정' })
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
  @ApiBearerAuth('RefreshToken')
  @UseGuards(AuthGuard('refresh'))
  @Get('access')
  async createAccessToken(@User('id') id: number) {
    return await this.usersService.createAccessToken(id);
  }

  @ApiOperation({ summary: '회원탈퇴' })
  @ApiBearerAuth('AccessToken')
  @UseGuards(AuthGuard('access'))
  @Delete()
  async updateDeletedAt(@User('id') id: number) {
    return this.usersService.updateDeletedAt(id);
  }
}
