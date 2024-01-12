import { Module } from '@nestjs/common';
import { MailService } from './mailer.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { Redis } from 'ioredis';
import { GenerateToken } from 'src/helpingfunctions/generatetoken';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    UserModule,
    RedisModule,
    AuthModule,
  ],
  providers: [MailService, RedisService, Redis, GenerateToken, AuthService],
  exports: [MailService],
})
export class MailerModule {}
