import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { User } from './entities/user.entity';

export class ConfirmEmailDto extends PickType(User, ['email'] as const) {}

export class ConfirmNicknameDto extends PickType(User, ['nickname'] as const) {}

export class ConfirmPhoneNumberDto extends PickType(User, ['phoneNumber'] as const) {}

export class CreateAuthNumberDto extends PickType(User, ['phoneNumber'] as const) {}

export class AuthTypeDto {}

export class ConfirmAuthNumberDto extends PickType(User, ['phoneNumber'] as const) {
  @ApiProperty({ required: true, description: '인증번호' })
  @IsString()
  authNumber: string;

  @ApiProperty({ enum: ['sign', 'email', 'password'], required: true, description: '인증타입' })
  @IsEnum({ Sign: 'sign', Email: 'email', Password: 'password' })
  type: 'sign' | 'email' | 'password';
}

export class CreateUserDto extends PickType(User, [
  'email',
  'nickname',
  'password',
  'phoneNumber',
  'isServiceTerms',
  'isPrivacyTerms',
  'isMarketingTerms',
] as const) {}

export class FindEmailDto extends PickType(User, ['phoneNumber'] as const) {}

export class UpdatePasswordDto extends PickType(User, ['phoneNumber', 'password'] as const) {}

export class SignInDto extends PickType(User, ['email', 'password'] as const) {}
