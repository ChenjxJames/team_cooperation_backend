import { Connection } from 'none-sql';
import { MySqlPool } from '../lib/MySql';

interface RolePermission {
  roleName: string;
  permissions: Array<string>;
}

export class Permission{
  
  connection!: Connection;

  constructor() {
    
  }

  async init() {
    try {
      if(!this.connection) {
        this.connection = await MySqlPool.getConnection();
      }    
    } catch (err) {
      throw err;
    }   
  }
  
  async getPermissions(roleId: number): Promise<RolePermission> {
    try {
      let sql = 'SELECT `role_name`,`permission_name` FROM `role` LEFT JOIN `role_permission` ON `role`.`role_id`=`role_permission`.`role_id` LEFT JOIN `permission` ON `role_permission`.`permission_id`=`permission`.`permission_id` WHERE `role`.`role_id` = ?';
      let result: any = await this.connection.query(sql, [roleId]);
      return {
        roleName: result.info[0].role_name,
        permissions: result.info.map((item: any)=>item.permission_name)
      }
    } catch (err) {
      throw err;
    }
  }

}