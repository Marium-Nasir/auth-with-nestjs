import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { EmailDto } from './email.interface';
import { RedisService } from 'src/redis/redis.service';
import { AuthService } from 'src/auth/auth.service';
import { verifyEmailTemplate } from './templates/verifyemail';
import { forgotPasswordTemplate } from './templates/forgotpassword';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly redisService: RedisService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  mailTransporter() {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        // user: 'mariumnasirse@gmail.com',
        // pass: 'xsmtpsib-a68402af8b3b3904df73ce4bc3c97cb083d5733fb887c24387b87417e8b8d9c3-pwODzbx1In0aF3Qd',
        user: this.configService.get<string>('UserEmail'),
        pass: this.configService.get<string>('sendInBlueKey'),
      },
    });
    return transporter;
  }

  generateSixDigitCode(): string {
    const min = 100000; // Minimum value for a 6-digit code
    const max = 999999; // Maximum value for a 6-digit code
    const sixDigitCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return sixDigitCode.toString();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async sendEmail(emailDto: EmailDto, userData, templateFn: Function) {
    const { from, recipients } = emailDto;
    const transport = this.mailTransporter();
    try {
      const genCode = this.generateSixDigitCode();
      console.log(genCode);

      if (!genCode) {
        const res = {
          status: 400,
          message: 'Code is not generated',
          data: null,
        };
        return res;
      } else {
        const val = await this.redisService.redisClient(genCode, 180, userData);
        const dynamicData = {
          userData: {
            name: userData.name,
          },
          otp: genCode,
        };
        const options: Mail.Options = {
          from,
          to: recipients,
          html: templateFn(dynamicData),
        };
        if (val) {
          await transport.sendMail(options);
          const res = {
            status: 200,
            message: 'Email send successfully',
            data: null,
          };
          return res;
        }
      }
    } catch (err) {
      const res = {
        status: 400,
        message: 'Enter Invalid Payload',
        data: { error: err },
      };
      console.log(err);

      return res;
    }
  }

  // async sendEmail(emailDto: EmailDto, userData) {
  //   const { from, recipients } = emailDto;
  //   const transport = this.mailTransporter();
  //   try {
  //     const genCode = this.generateSixDigitCode();
  //     console.log(genCode);

  //     if (!genCode) {
  //       const res = {
  //         status: 400,
  //         message: 'Code is not generated',
  //         data: null,
  //       };
  //       return res;
  //     } else {
  //       const val = await this.redisService.redisClient(genCode, 180, userData);
  //       const dynamicData = {
  //         userData: {
  //           name: userData.name,
  //         },
  //         otp: genCode,
  //       };
  //       const options: Mail.Options = {
  //         from,
  //         to: recipients,
  //         html: htmlContent,
  //       };
  //       if (val) {
  //         await transport.sendMail(options);
  //         const res = {
  //           status: 200,
  //           message: 'Email send successfully',
  //           data: null,
  //         };
  //         return res;
  //       }
  //     }
  //   } catch (err) {
  //     const res = {
  //       status: 400,
  //       message: 'Enter Invalid Payload',
  //       data: { error: err },
  //     };
  //     console.log(err);

  //     return res;
  //   }
  // }

  async signUp(emailDto: EmailDto, userData) {
    try {
      if (!userData.email || !userData.name) {
        const res = {
          status: 404,
          message: 'Please Enter Email or name',
          data: null,
        };
        return res;
      }
      const data = await this.authService.signUp(userData);
      if (data) {
        const templateFn = verifyEmailTemplate;
        await this.sendEmail(emailDto, userData, templateFn);
        const res = {
          status: 201,
          message: 'Data Saved in db, navigate to enter verification code page',
          data: data,
        };
        return res;
      }
    } catch (err) {
      console.log(err);
      const res = {
        status: 404,
        message:
          'Error Occurred while creating account in mongodb, due to duplicate email',
        data: { error_message: err },
      };
      return res;
    }
  }

  async resendOTP(emailDto: EmailDto, userData) {
    try {
      const email = userData.email;
      console.log(email + ' from resend otp');

      const isVerified = await this.authService.checkVerified(email);
      if (isVerified === true) {
        const templateFn = verifyEmailTemplate;
        await this.sendEmail(emailDto, userData, templateFn);
        const res = {
          status: 200,
          message: 'Email sent successfully',
          data: null,
        };
        return res;
      } else {
        const res = {
          status: 200,
          message: 'Email already verified',
          data: null,
        };
        return res;
      }
    } catch (err) {
      console.log(err);
      const res = {
        status: 400,
        message: 'Email not sent successfully due to invalid email',
        data: { error_message: err },
      };
      return res;
    }
  }

  async verifyEmail(enteredCode: string) {
    try {
      const code = await this.redisService.redisGetData(enteredCode);
      console.log(code);
      const data = JSON.parse(code);
      const email = data.email;
      if (!code) {
        const res = {
          status: 404,
          message: 'Invalid or expired code',
          data: null,
        };
        return res;
      } else {
        const data = await this.authService.verifiedEmail(email);
        if (data) {
          const res = {
            status: 200,
            message: 'Email Verified Successfully',
            data: null,
          };
          return res;
        } else {
          const res = {
            status: 200,
            message:
              'Error Occurred while creating account in mongodb due to expired or invalid code',
            data: null,
          };
          return res;
        }
      }
    } catch (err) {
      console.log(err);
      const res = {
        status: 404,
        message:
          'Error Occurred while creating account in mongodb due to expired or invalid code ',
        data: { error_message: err },
      };
      return res;
    }
  }

  async verifyCode(enteredCode: string) {
    try {
      const code = await this.redisService.redisGetData(enteredCode);
      console.log(code);

      if (!code) {
        const res = {
          status: 404,
          message: 'Invalid or expired code',
          data: null,
        };
        return res;
      } else {
        const res = {
          status: 200,
          message: 'Code verified and redirect to reset password page',
          data: null,
        };
        return res;
      }
    } catch (err) {
      console.log(err);
      const res = {
        status: 404,
        message: 'Invalid or expired code',
        data: { error_message: err },
      };
      return res;
    }
  }

  async resendForgotOTP(emailDto: EmailDto, userData) {
    try {
      if (!userData.email) {
        const res = {
          status: 400,
          message: 'Invalid payload',
          data: null,
        };
        return res;
      }
      const user = await this.authService.checkForgot(userData.email);
      if (user === false) {
        const res = {
          status: 404,
          message: 'User not exists',
          data: null,
        };
        return res;
      }
      const templateFn = forgotPasswordTemplate;
      await this.sendEmail(emailDto, userData, templateFn);
      const res = {
        status: 200,
        message: 'Email sent successfully',
        data: null,
      };
      return res;
    } catch (err) {
      console.log(err);
      const res = {
        status: 400,
        message: 'Email not sent successfully',
        data: { error_message: err },
      };
      return res;
    }
  }

  async forgotPass(emailDto: EmailDto, userData) {
    const user = await this.authService.checkForgot(userData.email);
    if (!user) {
      const res = {
        status: 404,
        message: 'User not exists',
        data: user,
      };
      return res;
    } else {
      const templateFn = forgotPasswordTemplate;
      await this.sendEmail(emailDto, userData, templateFn);
      const res = {
        status: 200,
        message: 'Email sent successfully',
        data: user,
      };
      return res;
    }
  }
  // async sendVerificationEmail(email: string, otp: string, templateId: number) {
  //   const apiKey = this.configService.get(
  //     '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',
  //   );

  //   console.log(SibApiV3Sdk + "SibApiV3Sdk");

  //   const defaultClient = SibApiV3Sdk.instance();
  //   console.log(defaultClient + 'defaultclient');

  //   defaultClient.authentications['apiKeyV3'].apiKey = apiKey;

  //   const sendinblueClient = new SibApiV3Sdk.TransactionalEmailsApi();
  //   const sendinblueData = new SendSmtpEmail();
  //   sendinblueData.to = [{ email: email }];
  //   sendinblueData.templateId = templateId;
  //   sendinblueData.params = { otp };

  //   try {
  //     const response = await sendinblueClient.sendTransacEmail(sendinblueData);
  //     console.log('Email sent successfully:', response);
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //     // Handle error appropriately
  //   }
  // }
}
