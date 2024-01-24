import nodemailer from 'nodemailer';

type MailInterface = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};
export default class MailService {
  private static instance: MailService;
  private transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: process.env.NEXT_SMTP_HOST,
    port: 465,
    secure: process.env.NEXT_SMTP_TLS === 'true' ? true : false,
    auth: {
      user: process.env.NEXT_SMTP_USER,
      pass: process.env.NEXT_SMTP_PASSWORD,
    },
  });

  static getInstance() {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  async sendMail(options: MailInterface) {
    return await this.transporter.sendMail({
      from: process.env.NEXT_SMTP_SENDER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
