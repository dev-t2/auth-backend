import { Role, User as UserModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsPositive,
  Matches,
} from 'class-validator';

export class User implements UserModel {
  @ApiProperty({ required: true, description: '아이디' })
  @IsPositive()
  id: number;

  @ApiProperty({ required: true, description: '이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: '닉네임' })
  @Matches(/^[가-힣a-zA-Z0-9]{2,10}$/, { message: 'nickname must be a nickname' })
  nickname: string;

  @ApiProperty({ required: true, description: '비밀번호' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_=+])[A-Za-z\d`~!@#$%^&*()_=+]{8,16}$/, {
    message: 'password must be a password',
  })
  password: string;

  @ApiProperty({ required: true, description: '전화번호' })
  @IsMobilePhone('ko-KR')
  phoneNumber: string;

  @ApiProperty({ description: '서비스 이용약관' })
  @IsBoolean()
  isServiceTerms: boolean;

  @ApiProperty({ description: '개인정보 이용약관' })
  @IsBoolean()
  isPrivacyTerms: boolean;

  @ApiProperty({ description: '마케팅 이용약관' })
  @IsBoolean()
  isMarketingTerms: boolean;

  @ApiProperty({ default: 'USER', description: '권한' })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ description: '생성된 날짜' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: '업데이트된 날짜' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ description: '삭제된 날짜' })
  @IsDate()
  deletedAt: Date | null;
}
