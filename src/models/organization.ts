import { Connection } from 'none-sql';
import { MySqlPool } from '../lib/MySql';

interface Organization {
  _organization_id: number;
  organization_name: string;
  email: string;
  create_time: string;
}

interface OrganizationUser {
  organization_id: number;
  user_id: number;
  role_id: number;
}

export class OrganizationImpl implements Organization {

  _organization_id: number = 0;
  get organization_id() {
    return this._organization_id;
  }
  organization_name: string = '';
  email: string = '';
  create_time: string = '';

  organizationUser: OrganizationUser = {
    organization_id: 0,
    user_id: 0,
    role_id: 3,
  }

  connection !: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }

  initValues() {
    this._organization_id = 0;
    this.organization_name = '';
    this.email = '';
    this.create_time = '';
  }

  setValues(
    {organization_name, email, create_time}: 
    {organization_name: string, email: string, create_time: string}
    ) {
    this.organization_name = organization_name;
    this.email = email;
    create_time = create_time;
  }

  async save() {
    try { 
      const sql = 'UPDATE `organization` SET `organization_name`=?,`email`=? WHERE `organization_id`=?';
      return await this.connection.query(sql, [this.organization_name, this.email, this._organization_id]);
    } catch (err) {
      throw err;
    }
  }

  async createOrganization(userId: number, name: string, email: string) {
    try {
      let sql = 'INSERT INTO `organization` (`organization_name`, `email`) VALUES (?, ?)';
      let result: any = await this.connection.query(sql, [name, email]);
      this.organizationUser.organization_id = result.info.insertId;
      this.organizationUser.user_id = userId;
      this.organizationUser.role_id = 1;
      await this.addUser(this.organizationUser.organization_id, this.organizationUser.user_id, this.organizationUser.role_id);
    } catch (err) {
      throw err;
    }
  }

  async removeOrganization() {
    try {
      this.connection.transaction(async () => {  
        let sql = 'DELETE FROM `organization_user` WHERE `organization_id`=?';
        await this.connection.query(sql, [this.organization_id]);
        sql = 'DELETE FROM `organization` WHERE `organization_id`=?';
        await this.connection.query(sql, [this.organization_id]);
      });
    } catch (err) {
      throw err;
    }
  }
  
  async getOrganizationByUserId(userId: number) { 
    try {
      this.initValues();
      let sql = 'SELECT * FROM `organization_user` WHERE `user_id`=?';
      let result: any = await this.connection.query(sql, [userId]);
      const organizationUser = result.info[0];
      if(organizationUser) {
        this.organizationUser = organizationUser;
        this._organization_id = organizationUser.organization_id | 0;
        sql = 'SELECT * FROM `organization` WHERE `organization_id`=?';
        result = await this.connection.query(sql, [organizationUser.organization_id]);
        this.setValues(result.info[0])
      }
    } catch (err) {
      throw err;
    }    
  }

  async addUser(organizationId: number, userId: number, roleId: number) {
    try {
      let sql = 'INSERT INTO `organization_user`(`organization_id`, `user_id`, `role_id`) VALUES(?, ?, ?)';
      await this.connection.query(sql, [organizationId, userId, roleId]);
    } catch (err) {
      throw err;
    }
  }

  async removeUser(userId: number, organizationId: number) {
    try {
      let sql = 'DELETE FROM `organization_user` WHERE `user_id`=? and organization_id=?';
      await this.connection.query(sql, [userId, organizationId]);
    } catch (err) {
      throw err;
    }
  }

  async setRole(organizationId: number, userId: number, roleId: number) {
    try { 
      const sql = 'UPDATE `organization_user` SET `role_id`=? WHERE `user_id`=? and organization_id=?';
      return await this.connection.query(sql, [roleId, userId, organizationId]);
    } catch (err) {
      throw err;
    }
  }

  async getOrganizationMembers() {
    try {
      const sql = 'SELECT `user`.`user_id`,`username`,`email`,`role_id` FROM `organization_user` LEFT JOIN `user` ON `organization_user`.`user_id`=`user`.`user_id` WHERE `organization_id`=?';
      return (await this.connection.query(sql, [this.organization_id])).info;
    } catch (err) {
      throw err;
    }
  }

}