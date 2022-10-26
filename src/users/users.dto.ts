import { PickType } from '@nestjs/swagger';

import { User } from './entities/user.entity';

export class ConfirmEmailDto extends PickType(User, ['email'] as const) {}

export class ConfirmNicknameDto extends PickType(User, ['nickname'] as const) {}

export class ConfirmPhoneNumberDto extends PickType(User, ['phoneNumber'] as const) {}

export class SignUpDto extends PickType(User, [
  'email',
  'nickname',
  'password',
  'phoneNumber',
  'isServiceTerms',
  'isPrivacyTerms',
  'isMarketingTerms',
] as const) {}

export class SignInDto extends PickType(User, ['email', 'password'] as const) {}
