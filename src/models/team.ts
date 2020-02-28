import { Connection } from 'none-sql';
import { MySqlPool } from '../lib/MySql';

interface Team {
  team_id: number;
  team_name: string;
  organization_id?: number;
  create_time: string;
  role_id: number;
}

interface Teams {
  teams: Array<Team>;
}

export class TeamImpl implements Teams {
  teams: Team[] = [];

  connection !: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }

  async getTeamInfo(userId: number) {
    try {
      this.teams = [];
      const sql = 'SELECT `team`.`team_id`,`team_name`,`organization_id`,`create_time`,`role_id` FROM `team_user` LEFT JOIN `team` ON `team_user`.`team_id`=`team`.`team_id` WHERE `user_id`=?';
      const result: any = await this.connection.query(sql, [userId]);
      result.info.forEach((team: any) => {
        this.teams.push({
          team_id: team.team_id,
          team_name: team.team_name,
          organization_id: team.organization_id,
          create_time: team.create_time,
          role_id: team.role_id
        });
      });
    } catch (err) {
      throw err;
    }
  }

  async createTeam(name: string, organizationId: number, userId: number) {
    try {
      await this.connection.transaction(async () => {
        let sql = 'INSERT INTO `team` (`team_name`, `organization_id`) VALUES (?, ?)';
        const result: any = await this.connection.query(sql, [name, organizationId]);
        sql = 'INSERT INTO `team_user`(`team_id`, `user_id`, `role_id`) VALUES(?, ?, ?)';
        await this.connection.query(sql, [result.info.insertId, userId, 4]);
      });      
    } catch (err) {
      throw err;
    }
  }

  async addUser(teamId: number, email: string, roleId: number){
    try {
      const sql = 'INSERT INTO `team_user`(`team_id`, `user_id`, `role_id`) VALUES(? , (SELECT `user_id` FROM `user` WHERE `email`=?), ?)';
      await this.connection.query(sql, [teamId, email, roleId]);
    } catch (err) {
      throw err;
    }
  }

}