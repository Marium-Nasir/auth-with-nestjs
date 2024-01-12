import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/user/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { GenerateToken } from 'src/helpingfunctions/generatetoken';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisService } from 'src/redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';
import { Redis } from 'ioredis';
import { MailService } from 'src/mailer/mailer.service';

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
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    RedisModule,
    // MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GenerateToken, RedisService, Redis, MailService],
})
export class AuthModule {}
