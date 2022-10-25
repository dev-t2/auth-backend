import { Plan as PlanModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsPositive } from 'class-validator';

export class Plan implements PlanModel {
  @ApiProperty({ required: true, description: '아이디' })
  @IsPositive()
  id: number;

  @ApiProperty({ required: true, description: '유저 아이디' })
  @IsPositive()
  userId: number | null;

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
