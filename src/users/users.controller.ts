import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'src/auth/decorators';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import {
  ConfirmAuthDto,
  CreateUserDto,
  DuplicateEmailDto,
  DuplicateNicknameDto,
  PhoneNumberDto,
  SignInDto,
  UpdatePasswordDto,
} from './users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '이메일 중복 확인' })
  @Post('email/duplication')
  async duplicateEmail(@Body() { email }: DuplicateEmailDto) {
    return await this.usersService.duplicateEmail(email);
  }

  @ApiOperation({ summary: '닉네임 중복 확인' })
  @Post('nickname/duplication')
  async duplicateNickname(@Body() { nickname }: DuplicateNicknameDto) {
    return await this.usersService.duplicateNickname(nickname);
  }

  @ApiOperation({ summary: '전화번호 중복 확인' })
  @Post('phone/duplication')
  async duplicatePhone(@Body() { phoneNumber }: PhoneNumberDto) {
    return await this.usersService.duplicatePhone(phoneNumber);
  }

  @ApiOperation({ summary: '인증번호 전송' })
  @Post('auth/message')
  async createAuthMessage(@Body() { phoneNumber }: PhoneNumberDto) {
    return await this.authService.createAuthMessage(phoneNumber);
  }

  @ApiOperation({ summary: '인증번호 확인' })
  @Post('auth')
  async confirmAuth(@Body() { phoneNumber, authNumber }: ConfirmAuthDto) {
    return await this.authService.confirmAuth(phoneNumber, authNumber);
  }

  @ApiOperation({ summary: '회원 가입' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '전화번호 확인' })
  @Post('phone')
  async findPhone(@Body() { phoneNumber }: PhoneNumberDto) {
    return this.usersService.findPhone(phoneNumber);
  }

  @ApiOperation({ summary: '이메일 찾기' })
  @Post('email')
  async findEmail(@Body() { phoneNumber }: PhoneNumberDto) {
    return await this.usersService.findEmail(phoneNumber);
  }

  @ApiOperation({ summary: '비밀번호 변경' })
  @Put('password')
  async updatePassword(@Body() { phoneNumber, password }: UpdatePasswordDto) {
    return await this.usersService.updatePassword(phoneNumber, password);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('sign')
  async signIn(@Body() { email, password }: SignInDto) {
    return await this.authService.signIn(email, password);
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiBearerAuth('RefreshToken')
  @UseGuards(AuthGuard('refresh'))
  @Get('access')
  async createAccessToken(@User('id') id: number) {
    return await this.authService.createAccessToken(id);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('AccessToken')
  @UseGuards(AuthGuard('access'))
  @Delete('sign')
  async signOut() {
    return;
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiBearerAuth('AccessToken')
  @UseGuards(AuthGuard('access'))
  @Delete()
  async updateDeletedAt(@User('id') id: number) {
    return this.usersService.updateDeletedAt(id);
  }
}
