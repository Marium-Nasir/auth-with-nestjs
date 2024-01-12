import { Post, Body, Controller, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/dto/signup.dto';
// import { LogInDto } from 'src/dto/login.dto';
import { RedisService } from 'src/redis/redis.service';
import { MailService } from 'src/mailer/mailer.service';
import { EmailDto } from 'src/mailer/email.interface';
// import { AuthGuard } from './auth.guard';
import { LogInDto } from 'src/dto/login.dto';
import { ForgotPasswordDto } from 'src/dto/forgetpassword.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private redisService: RedisService,
    private mailerService: MailService,
  ) {}
  // Sign-up and login routes
  @Post('sendemail')
  async sendMail(@Body() userData: SignUpDto): Promise<any> {
    const dto: EmailDto = {
      from: { name: 'Marium', address: 'mariumnasirse@gmail.com' },
      recipients: [{ name: userData.name, address: userData.email }],
      subject: 'Verify Your Email',
    };
    const res = await this.mailerService.signUp(dto, userData);
    return res;
  }

  @Post('verifyemail')
  async verifyEmail(@Body() code): Promise<any> {
    const res = await this.mailerService.verifyEmail(code.code);
    return res;
  }

  @Post('login')
  async LogInUser(@Body() logInDto: LogInDto): Promise<any> {
    return await this.authService.signIn(logInDto);
  }

  @Post('resendotp')
  async resendOtp(@Body() userData): Promise<any> {
    console.log('from resend otp');

    const dto: EmailDto = {
      from: { name: 'Marium', address: 'mariumnasirse@gmail.com' },
      recipients: [{ name: userData.name, address: userData.email }],
      subject: 'Verify Your Email',
    };
    const res = await this.mailerService.resendOTP(dto, userData);
    return res;
  }

  @Put('setpass')
  async setPass(@Body() userData): Promise<any> {
    return await this.authService.setPassword(userData);
  }

  // Reset Password routes
  @Post('forgetpassword')
  async sendForgetPassMail(@Body() userData: ForgotPasswordDto): Promise<any> {
    // const code = '123456';
    const dto: EmailDto = {
      from: { name: 'Marium', address: 'mariumnasirse@gmail.com' },
      recipients: [{ name: 'User', address: userData.email }],
      subject: 'Verify Your Code',
    };
    return await this.mailerService.forgotPass(dto, userData);
  }
  @Post('verifycode')
  async verifyCode(@Body() code): Promise<any> {
    return await this.mailerService.verifyCode(code.code);
  }

  @Post('resendforgototp')
  async resendCode(@Body() userData): Promise<any> {
    const dto: EmailDto = {
      from: { name: 'Marium', address: 'mariumnasirse@gmail.com' },
      recipients: [{ name: 'User', address: userData.email }],
      subject: 'Verify Your Code',
    };
    return await this.mailerService.resendForgotOTP(dto, userData);
  }
}
