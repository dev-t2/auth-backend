import { Body, Controller, Delete, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'src/auth/decorators';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
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

@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '이메일 확인' })
  @Post('email')
  async confirmEmail(@Body() { email }: ConfirmEmailDto) {
    return await this.usersService.confirmEmail(email);
  }

  @ApiOperation({ summary: '닉네임 확인' })
  @Post('nickname')
  async confirmNickname(@Body() { nickname }: ConfirmNicknameDto) {
    return await this.usersService.confirmNickname(nickname);
  }

  @ApiOperation({ summary: '전화번호 확인' })
  @Post('phoneNumber')
  async confirmPhoneNumber(
    @Query('isDup') isDup: boolean,
    @Body() { phoneNumber }: ConfirmPhoneNumberDto,
  ) {
    return await this.usersService.confirmPhoneNumber(isDup, phoneNumber);
  }

  @ApiOperation({ summary: '인증번호 전송' })
  @Post('authNumber')
  async createAuthNumber(@Body() { phoneNumber }: CreateAuthNumberDto) {
    return await this.authService.sendAuthNumberMessage(phoneNumber);
  }

  @ApiOperation({ summary: '인증번호 확인' })
  @Put('authNumber')
  async confirmAuthNumber(@Body() confirmAuthNumberDto: ConfirmAuthNumberDto) {
    return await this.authService.confirmAuthNumber(confirmAuthNumberDto);
  }

  @ApiOperation({ summary: '회원 가입' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '이메일 찾기' })
  @Put('email')
  async findEmail(@Body() findEmailDto: FindEmailDto) {
    return await this.usersService.findEmail(findEmailDto);
  }

  @ApiOperation({ summary: '비밀번호 변경' })
  @Put('password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.usersService.updatePassword(updatePasswordDto);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('signIn')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: '토큰 생성' })
  @ApiBearerAuth('RefreshToken')
  @UseGuards(AuthGuard('refresh'))
  @Post('accessToken')
  async createAccessToken(@User('id') id: number) {
    return await this.authService.createAccessToken(id);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiBearerAuth('AccessToken')
  @UseGuards(AuthGuard('access'))
  @Delete()
  async updateDeletedAt(@User('id') id: number) {
    return this.usersService.updateDeletedAt(id);
  }
}
