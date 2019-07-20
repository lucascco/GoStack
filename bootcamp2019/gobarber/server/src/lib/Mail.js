import nodemailer from 'nodemailer';
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
  }

  sendEmail(message) {
    this.transporter.sendMail({
      ...message,
      ...mailConfig.default,
    });
  }
}

export default new Mail();
