import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HttpLoggerMiddleware } from './common/middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        ADMIN_NAME: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        NAVER_ACCESS_KEY: Joi.string().required(),
        NAVER_SECRET_KEY: Joi.string().required(),
        NAVER_SERVICE_ID: Joi.string().required(),
        NAVER_PHONE_NUMBER: Joi.number().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    CacheModule.register({ isGlobal: true, ttl: 5 * 60 * 1000 }),
    UsersModule,
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
