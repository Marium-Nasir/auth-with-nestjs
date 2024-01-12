/* eslint-disable prettier/prettier */
import { Address } from 'nodemailer/lib/mailer';

export type EmailDto = {
  from?: Address;
  recipients: Address[];
  subject: string;
  html?: string;
  text?: string;
  placeholderReplacements?: Record<string,string>;
};
