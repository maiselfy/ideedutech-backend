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
  transport: `smtps://${process.env.USER_MAILER}:${process.env.PASS_MAILER}@smtp.gmail.com/pool=true`,
  /*  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'fabriciopinheiro713@gmail.com',
      pass: 'idealize2022F',
    },
    tls: {
      rejectUnauthorized: false,
    },
  }, */
};
