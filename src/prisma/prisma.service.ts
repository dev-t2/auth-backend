import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log:
        process.env.NODE_ENV !== 'production'
          ? ['query', 'info', 'warn', 'error']
          : ['info', 'warn', 'error'],
    });

    this.$use(async (params, next) => {
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'].deletedAt = new Date();
      }

      if (params.action == 'deleteMany') {
        params.action = 'updateMany';
        params.args['data'].deletedAt = new Date();
      }

      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
