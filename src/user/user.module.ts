import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, userSchema } from './schemas/user.schema';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserModule],
})
export class UserModule {}
