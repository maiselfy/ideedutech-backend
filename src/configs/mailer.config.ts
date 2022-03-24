import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mailerConfig: MailerOptions = {
  template: {
    dir: process.cwd() + '/templates/',
    adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
    options: {
      strict: true,
    },
  },
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'italolima534@gmail.com',
      pass: process.env.PASS_MAILER,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
};
