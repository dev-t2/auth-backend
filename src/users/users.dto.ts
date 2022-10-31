import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { User } from './entities/user.entity';

export class DuplicateEmailDto extends PickType(User, ['email'] as const) {}

export class DuplicateNicknameDto extends PickType(User, ['nickname'] as const) {}

export class PhoneNumberDto extends PickType(User, ['phoneNumber'] as const) {}

export class ConfirmAuthDto extends PhoneNumberDto {
  @ApiProperty({ required: true, description: '인증번호' })
  @IsString()
  authNumber: string;
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

export class UpdatePasswordDto extends PickType(User, ['phoneNumber', 'password'] as const) {}

export class SignInDto extends PickType(User, ['email', 'password'] as const) {}
