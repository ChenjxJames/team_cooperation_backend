import nodemailer from 'nodemailer';
import { MAIL_CONFIG } from '../config/mail';

class MailTemplate {

  public static resetPassword(username: string, resetPasswordLink: string) {
    return `
    <div style="width: 100%; background-color: #f0f0f0; padding: 50px 0;">
      <div style="width: 500px; background-color: white; margin: 0 auto; border-radius: 5px; text-align: center;">
        <div style="width:100%; background-color: #2196f3; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 10px 0;">
          <div style="color:white; font-size: 20px; font-weight: bold;">Team Cooperation</div>
        </div>
        <div style="padding: 10px 5px 50px 5px;">
          <h3>尊敬的 ${username} 先生/女士</h3>
          <p style="margin-bottom: 30px;">请通过下方链接重新设置您的Team Cooperation密码。</p>
          <a style="padding: 10px 50px; color: white; background-color: #1CB384; border-radius:5px; text-decoration: none;" href="${resetPasswordLink}">重置密码</a>
        </div>
      </div style="width: 100%; background-color: #f0f0f0;">  
    </div>
    `
  }

  public static inform(title: string, message: string) {
    return `
    <div style="width: 100%; background-color: #f0f0f0; padding: 50px 0;">
      <div style="width: 500px; background-color: white; margin: 0 auto; border-radius: 5px; text-align: center;">
        <div style="width:100%; background-color: #2196f3; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 10px 0;">
          <div style="color:white; font-size: 20px; font-weight: bold;">Team Cooperation</div>
        </div>
        <div style="padding: 10px 5px 50px 5px;">
          <h3>${title}</h3>
          <p style="margin-bottom: 30px;">${message}</p>
        </div>
      </div style="width: 100%; background-color: #f0f0f0;">  
    </div>
    `
  }
}

export default class Mail {

  async sendEmail(email: string, subject: string, html: string) {
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
      subject: subject, // Subject line
      html: html, // html body
    });
    await nodemailer.getTestMessageUrl(info);
  }

  linkDispose(link: string) {
    if (link.indexOf('http') != 0) {
      return 'http://' + link;
    }
    return link;
  }

  async sendForgetPasswordEmail(email: string, username: string, resetPasswordLink: string) {
    await this.sendEmail(email, "重置密码", MailTemplate.resetPassword(username, this.linkDispose(resetPasswordLink)));
  }
  
  async sendInform(email: string, title: string, message: string) {
    await this.sendEmail(email, title, MailTemplate.inform(title, message));
  }
}