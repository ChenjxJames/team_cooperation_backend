import { Connection } from 'none-sql';
import { MySqlPool } from '../lib/MySql';

interface RolePermission {
  id?: number;
  roleName: string;
  permissions: Array<string>;
}

export class Permission{
  
  connection!: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }
  
  async getPermissions(roleId: number): Promise<RolePermission> {
    try {
      const sql = 'SELECT `role_name`,`permission_name` FROM `role` LEFT JOIN `role_permission` ON `role`.`role_id`=`role_permission`.`role_id` LEFT JOIN `permission` ON `role_permission`.`permission_id`=`permission`.`permission_id` WHERE `role`.`role_id` = ?';
      const result: any = await this.connection.query(sql, [roleId]);
      return {
        roleName: result.info[0].role_name,
        permissions: result.info.map((item: any)=>item.permission_name)
      }
    } catch (err) {
      throw err;
    }
  }

  async getAllRolePermissions(): Promise<RolePermission[]> {
    try {
      const sql = 'SELECT `role`.`role_id`,`role_name`,`permission_name` FROM `role` LEFT JOIN `role_permission` ON `role`.`role_id`=`role_permission`.`role_id` LEFT JOIN `permission` ON `role_permission`.`permission_id`=`permission`.`permission_id` ORDER BY `role_id`';
      const result: any = await this.connection.query(sql, []);
      const data: RolePermission[] = [];
      let role_id = -1;
      result.info.forEach((row: any) => {
        if (row.role_id === role_id) {
          data[data.length-1].permissions.push(row.permission_name);
        } else {
          role_id = row.role_id;
          const rolePermission: RolePermission = {
            id: row.role_id,
            roleName: row.role_name,
            permissions: [row.permission_name],
          }
          data.push(rolePermission);
        }
      })
      return data;
    } catch (err) {
      throw err;
    }
  }

}