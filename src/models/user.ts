import { Connection } from 'none-sql';

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
  get user() {
    return this._user_id;
  }
  username: string = '';
  password: string = '';
  email: string = '';
  phone: number | null = null;
  create_time: string = '';
  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  setValues(username: string, password: string, email: string, phone: number, create_time: string) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.create_time = create_time;
  }

  async getUserByUsername(username: string) {
    const sql = 'SELECT `user_id`,`username`, LOWER(HEX(`password`)) as password,email,phone,create_time FROM `user` WHERE `username`=?';
    const result: any = await this.connection.query(sql, [username]);
    const user = result.info[0];
    this._user_id = user.user_id;
    this.setValues(user.username, user.password, user.email, user.phone, user.create_time);
  }

  async save() {
    if (this._user_id) {
      await this.updateUser();
    } else {
      await this.createUser();
    }
  }

  async updateUser() {
    const sql = 'UPDATE `user` SET `username`=?,`password`=UNHEX(?),`email`=?,`phone`=? WHERE `user_id`=?;';
    return await this.connection.query(sql, [this.username, this.password, this.email, this.phone, this._user_id]);
  }

  async createUser() {
    const sql = 'INSERT INTO `user`(`username`, `password`, `email`) VALUES(?, UNHEX(?), ?);';
    return await this.connection.query(sql, [this.username, this.password, this.email]);
  }
}