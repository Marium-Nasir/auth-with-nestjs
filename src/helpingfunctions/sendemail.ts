/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
// import { SibApiV3Sdk, CreateContact, SendSmtpEmail } from 'sib-api-v3-sdk';

@Injectable()
export class SendEmail {
  constructor(private readonly redisService: RedisService) {}

  // async sendVerificationEmail(userData, otp, templateId) {
  //   console.log(SibApiV3Sdk + 'sibapi');

  //   const apiKey =
  //     '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';
  //   const defaultClient = new SibApiV3Sdk.ApiClient.instance();
  //   console.log(defaultClient + 'default client');

  //   const apiKeyV3 = defaultClient.authentications['apiKeyV3'];
  //   apiKeyV3.apiKey = apiKey;
  //   // SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey =
  //   //   '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';
  //   const sendinblueClient = new SibApiV3Sdk.TransactionalEmailsApi();
  //   const email = userData.email;
  //   const sendinblueData = new SibApiV3Sdk.SendSmtpEmail();
  //   sendinblueData.to = [{ email: email }];
  //   sendinblueData.templateId = templateId;
  //   sendinblueData.params = {
  //     otp: otp,
  //   };
  //   try {
  //     const response = await sendinblueClient.sendTransacEmail(sendinblueData);
  //     console.log('Email sent successfully:', response);
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //     // Handle error appropriately
  //   }
  // }
}
