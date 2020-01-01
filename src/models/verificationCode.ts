import mongoose from 'mongoose';
import { MONGODB_URIS, MONGODB_OPTIONS } from '../config/db';

const schema = {
  user_id: Number,
  verification_code: String,
  updatedAt: {
    default: new Date(),
    expires: 86400, // 1 day
    type: Date
  }
};

interface VerificationCode {
  user_id: number,
  verification_code: string
}

export class VerificationCodeImpl implements VerificationCode {
  user_id: number = 0;
  verification_code: string = '';

  connection: any;
  static Model: any;

  constructor() {
    this.connection = mongoose;
    this.connection.connect(MONGODB_URIS, MONGODB_OPTIONS);
    if (!VerificationCodeImpl.Model) {
      const collection = 'verification_code';
      const name = 'verification_code';
      const expires = 86400;
      const updatedAt = { ...schema.updatedAt, expires };
      const { Schema } = this.connection;
      VerificationCodeImpl.Model = this.connection.model(name, new Schema({ ...schema, updatedAt }), collection);
    }
  }

  async create(user_id: number, verification_code: string) {
    return new Promise((resolve, reject) => {
      const model = new VerificationCodeImpl.Model({
        user_id: user_id,
        verification_code: verification_code
      });
      model.save((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve('Save successful.');
        }
      });
    });
  }

  async getByCode(userId: number, verification_code: string) {
    try {
      return await VerificationCodeImpl.Model.findOne({ user_id: userId, verification_code: verification_code });
    } catch (err) {
      throw err;
    }
  }

  async removeByUserId(user_id: number) {
    try {
      return await VerificationCodeImpl.Model.deleteMany({ user_id: user_id });
    } catch (err) {
      throw err;
    }
  }
}