import { PickType } from '@nestjs/swagger';

import { User } from './entities/user.entity';

export class ConfirmEmailDto extends PickType(User, ['email'] as const) {}

export class ConfirmNicknameDto extends PickType(User, ['nickname'] as const) {}

export class ConfirmPhoneNumberDto extends PickType(User, ['phoneNumber'] as const) {}

export class CreateUserDto extends PickType(User, [
  'email',
  'nickname',
  'password',
  'phoneNumber',
  'isServiceTerms',
  'isPrivacyTerms',
  'isMarketingTerms',
] as const) {}

export class UserDto extends PickType(User, ['id'] as const) {}

export class FindEmailDto extends PickType(User, ['phoneNumber'] as const) {}

export class PasswordResetDto extends PickType(User, ['password', 'phoneNumber'] as const) {}

export class SignInDto extends PickType(User, ['email', 'password'] as const) {}
