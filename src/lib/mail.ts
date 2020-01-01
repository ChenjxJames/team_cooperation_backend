import nodemailer from 'nodemailer';
import { MAIL_CONFIG } from '../config/mail';

export class Mail {

  async sendForgetPasswordEmail(email: string, username: string, resetPasswordLink: string) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: MAIL_CONFIG.host,
      port: MAIL_CONFIG.port,
      secure: true, // true for 465, false for other ports
      auth: {
        user: MAIL_CONFIG.username, // generated ethereal user
        pass: MAIL_CONFIG.password // generated ethereal password
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: MAIL_CONFIG.from, // sender address
      to: email, // list of receivers
      subject: "重置密码", // Subject line
      html: `<h3>尊敬的${username}先生/女士</h3>
      <p>请通过下方链接重新设置您的Team Cooperation密码。</p>
      <a href="${this.linkDispose(resetPasswordLink)}">重置密码</a>
      `, // html body
    });
    await nodemailer.getTestMessageUrl(info);
  }

  linkDispose(link: string) {
    if (link.indexOf('http') != 0) {
      return 'http://' + link;
    }
    return link;
  }
  
}