import nodemailer from 'nodemailer';
import { resolve } from 'path';
import expresshbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { auth, port, host, secure } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
    this.configureTemplate();
  }

  configureTemplate() {
    const viewsPath = resolve(__dirname, '..', 'app', 'views', 'email');
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: expresshbs.create({
          layoutsDir: resolve(viewsPath, 'layouts'),
          partialsDir: resolve(viewsPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath: viewsPath,
        extName: '.hbs',
      })
    );
  }

  sendEmail(message) {
    this.transporter.sendMail({
      ...message,
      ...mailConfig.default,
    });
  }
}

export default new Mail();
