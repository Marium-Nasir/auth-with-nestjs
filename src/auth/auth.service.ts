import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { GenerateToken } from 'src/helpingfunctions/generatetoken';
import { SignUpDto } from 'src/dto/signup.dto';
import { LogInDto } from 'src/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly genToken: GenerateToken,
    // private readonly sendEmail: SendEmail,
    // private readonly SibApiV3Sdk: SibApiV3Sdk,
  ) {}
  async signUp(signUpDto: SignUpDto): Promise<object> {
    const { name, email } = signUpDto;
    const user = await this.userModel.create({
      name,
      email,
    });
    if (!user) {
      const res = {
        status: 400,
        message: 'Error Occurred while creating account in mongodb',
        data: null,
      };
      return res;
    }
    console.log(user._id);

    const payload = { id: user._id };
    const time = 30000;
    const token = await this.genToken.genToken(payload, time);
    console.log(token + ' from signup');

    return { user, token };
  }

  async setPassword(userData): Promise<any> {
    const { email, password } = userData;
    console.log(email, password);

    try {
      const user = await this.userModel.findOne({ email: email });
      if (!user) {
        const res = {
          status: 404,
          message: 'User not exists',
          data: null,
        };
        return res;
      }
      if (user.isVerified === false) {
        const res = {
          status: 200,
          message: 'Please verify your email before set your Password',
          data: null,
        };
        return res;
      }
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);
      const data = await this.userModel.findOneAndUpdate(
        { email: email },
        { password: hashedPassword },
        { new: true },
      );
      console.log(data);
      const res = {
        status: 200,
        message: 'Password Saved Successfully',
        data: null,
      };
      return res;
    } catch (err) {
      console.log(err);
      const res = {
        status: 400,
        message: 'Error Occurred while set/update the password',
        data: { error_message: err },
      };
      return res;
    }
  }

  async signIn(logInDto: LogInDto): Promise<any> {
    try {
      const email = logInDto.email;

      if (!email) {
        const res = {
          status: 200,
          message: 'Enter Email',
          data: null,
        };
        return res;
      }
      const user = await this.userModel.findOne({ email });
      if (!user) {
        const res = {
          status: 404,
          message: 'Invalid credentials',
          data: null,
        };
        return res;
      }
      const payload = { id: user._id };
      const time = 30000;

      const token = await this.genToken.genToken(payload, time);
      const pass = await bcrypt.compare(logInDto.password, user.password);
      if (user && pass) {
        const res = {
          status: 200,
          message: 'Successfully sign-in',
          data: { user, token },
        };
        return res;
      } else {
        const res = {
          status: 404,
          message: 'invalid credentials',
          data: null,
        };
        return res;
      }
    } catch (err) {
      console.log(err);
      const res = {
        status: 404,
        message: 'Invalid Credentials',
        data: null,
      };
      return res;
    }
  }

  async verifiedEmail(email: string): Promise<any> {
    try {
      const data = await this.userModel.findOneAndUpdate(
        { email: email },
        { isVerified: true },
        { new: true },
      );
      console.log(data);
      const res = {
        status: 200,
        message:
          'Email Verified Successfully, now navigate to set Password Page',
        data: null,
      };
      return res;
    } catch (err) {
      console.log(err);
      const res = {
        status: 404,
        message: 'Error Occurred while updating isVerified attribute',
        data: { error_message: err },
      };
      return res;
    }
  }

  async checkVerified(email: string): Promise<any> {
    console.log(email + ' from check');

    const data = await this.userModel.findOne({ email: email });
    if (data.isVerified === false) return true;
  }

  async checkForgot(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }
}
