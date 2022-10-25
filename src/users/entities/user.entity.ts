import { Role, User as UserModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class User implements UserModel {
  @ApiProperty({ required: true, description: '아이디' })
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: true, description: '이메일' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, description: '닉네임' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ required: true, description: '비밀번호' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true, description: '전화번호' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ default: false, description: '서비스 이용약관' })
  @IsBoolean()
  isServiceTerms: boolean;

  @ApiProperty({ default: false, description: '개인정보 이용약관' })
  @IsBoolean()
  isPrivacyTerms: boolean;

  @ApiProperty({ default: false, description: '마케팅 이용약관' })
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
