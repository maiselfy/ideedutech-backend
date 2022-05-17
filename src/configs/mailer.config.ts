import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const mailerConfig: MailerOptions = {
  template: {
    dir: path.resolve(__dirname, '..', '..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
    },
  },
  transport: `smtps://fabriciopinheiro713@gmail.com:playerfoco07@smtp.gmail.com/pool=true`,
  /* transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'fabriciopinheiro713@gmail.com',
      pass: 'playerfoco07',
    },
    tls: {
      rejectUnauthorized: false,
    },
  }, */
};
