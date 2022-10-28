import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { User } from './entities/user.entity';

export class ConfirmEmailDto extends PickType(User, ['email'] as const) {}

export class ConfirmNicknameDto extends PickType(User, ['nickname'] as const) {}

export class ConfirmPhoneNumberDto extends PickType(User, ['phoneNumber'] as const) {}

export class ConfirmAuthNumberDto {
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

export class FindPhoneNumberDto extends PickType(User, ['phoneNumber'] as const) {}

export class FindEmailDto extends PickType(User, ['phoneNumber'] as const) {}

export class UpdatePasswordDto extends PickType(User, ['password', 'phoneNumber'] as const) {}

export class SignInDto extends PickType(User, ['email', 'password'] as const) {}
