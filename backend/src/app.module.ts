import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import {env} from './env';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      name: 'global',
      ttl: env.THROTTLE_TTL,
      limit: env.THROTTLE_LIMIT,
    }]),
    MongooseModule.forRoot(env.DATABASE_URI),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Enable the ThrottlerGuard globally
    },
  ],
})
export class AppModule {}