import { Connection } from 'none-sql';
import { MySqlPool } from '../lib/mysql';

interface User {
  _user_id: number;
  username: string;
  password: string;
  email: string;
  phone: number | null;
  create_time: string;
}

export class UserImpl implements User {
  _user_id: number = 0;
  get user_id() {
    return this._user_id; 
  }
  username: string = '';
  password: string = '';
  email: string = '';
  phone: number | null = null;
  create_time: string = '';
  connection!: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }

  setValues(username: string, password: string, email: string, phone: number, create_time: string) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.create_time = create_time;
  }

  async getUserByUserId(userId: number) {
    try {
      const sql = 'SELECT `user_id`,`username`, LOWER(HEX(`password`)) as password,email,phone,create_time FROM `user` WHERE `user_id`=?';
      const result: any = await this.connection.query(sql, [userId]);
      const user = result.info[0];
      this._user_id = user.user_id;
      this.setValues(user.username, user.password, user.email, user.phone, user.create_time);
    } catch (err) {
      throw err;
    }   
  }

  async getUserByUsername(username: string) {
    try {
      const sql = 'SELECT `user_id`,`username`, LOWER(HEX(`password`)) as password,email,phone,create_time FROM `user` WHERE `username`=?';
      const result: any = await this.connection.query(sql, [username]);
      const user = result.info[0];
      this._user_id = user.user_id;
      this.setValues(user.username, user.password, user.email, user.phone, user.create_time);
    } catch (err) {
      throw err;
    }    
  }

  async getUserByEmail(email: string) {
    try {
      const sql = 'SELECT `user_id`,`username`, LOWER(HEX(`password`)) as password,email,phone,create_time FROM `user` WHERE `email`=?';
      const result: any = await this.connection.query(sql, [email]);
      const user = result.info[0];
      this._user_id = user.user_id;
      this.setValues(user.username, user.password, user.email, user.phone, user.create_time);
    } catch (err) {
      throw err;
    }    
  }

  async save() {
    try { 
      const sql = 'UPDATE `user` SET `username`=?,`password`=UNHEX(?),`email`=?,`phone`=? WHERE `user_id`=?;';
      return await this.connection.query(sql, [this.username, this.password, this.email, this.phone, this._user_id]);
    } catch (err) {
      throw err;
    }
  }

  async createUser() {
    try { 
      const sql = 'INSERT INTO `user`(`username`, `password`, `email`) VALUES(?, UNHEX(?), ?);';
      return await this.connection.query(sql, [this.username, this.password, this.email]);
    } catch (err) {
      throw err;
    }
  }
}