import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { PlansRepository } from './plans.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PlansController],
  providers: [PlansService, PlansRepository],
})
export class PlansModule {}
