import { PartialType } from '@nestjs/swagger';

export class CreatePlanDto {}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
