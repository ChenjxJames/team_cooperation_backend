import md5 from 'md5';

import { UserImpl } from "../models/user";
import { VerificationCodeImpl } from '../models/verificationCode';
import Mail from '../lib/mail';
import { HOSTNAME } from '../config/index';
import { SALT } from '../config/security';

export class UserService {
  userImpl: UserImpl;

  constructor() {
    this.userImpl = new UserImpl();
  }

  async login(username: string, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userImpl.getUserByUsername(username);
        let result = {
          succeeded: this.userImpl.password === this.encrypt(password),
          user_id: this.userImpl.user_id,
          email: this.userImpl.email
        }
        resolve(result);
      } catch (err) {
        let result = {
          succeeded: false,
        }
        resolve(result);
      }
    });      
  }

  async register(username: string, password: string, email: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = new UserImpl();
        this.userImpl.username = username;
        this.userImpl.password = this.encrypt(password);
        this.userImpl.email = email;
        await this.userImpl.createUser();
        resolve(true);
      } catch (err) {
        resolve(false);
      }
    });
  }

  async changePassword(username: string, newPassword: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userImpl.getUserByUsername(username);
        this.userImpl.password = this.encrypt(newPassword);
        this.userImpl.save();
        await this.userImpl.save();
        resolve(true);
      } catch (err) {
        resolve(false);
      }
    });
  }

  async resetPassword(userId: number, username: string, password: string, verification_code: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let verificationCode =  new VerificationCodeImpl();
        let result = await verificationCode.getByCode(userId, verification_code);
        if(result.user_id) {
          await this.userImpl.getUserByUserId(userId);
          if(this.userImpl.username === username) {
            await this.changePassword(username, password);
            verificationCode.removeByUserId(userId);
          }      
        }
        resolve(true);
      } catch (err) {
        resolve(false);
      }
    });
  }

  async forgetPassword(email: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userImpl.getUserByEmail(email);

        let verificationCode = new VerificationCodeImpl();
        let time = new Date();
        let code = md5(time.toString() + SALT);
        verificationCode.create(this.userImpl._user_id , code);

        let mail = new Mail();
        await mail.sendForgetPasswordEmail(email, this.userImpl.username, `${HOSTNAME}/resetPassword?id=${this.userImpl._user_id}&code=${code}`);

        resolve(true);
      } catch (err) {
        resolve(false);
      }
    });
  }

  async getUsernameById(user_id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userImpl.getUserByUserId(user_id);
        resolve(this.userImpl.username);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getUserIdByEmail(email: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userImpl.getUserByEmail(email);
        resolve(this.userImpl.user_id);
      } catch (err) {
        reject("Email is error");
      }
    });
  }

  encrypt(plaintext: string): string {
    return md5(plaintext + SALT);
  }
}