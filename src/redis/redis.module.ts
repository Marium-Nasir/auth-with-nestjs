import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    UserModule,
    // AuthModule,
  ],
  providers: [RedisService, Redis],
})
export class RedisModule {}
