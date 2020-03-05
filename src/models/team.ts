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

interface Member {
  user_id: number;
  role_id: number;
  username: string;
  email: string;
}

export class TeamImpl implements Teams {
  teams: Team[] = [];
  members: Member[] = [];

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

  async updateTeamInfo(teamId: number, teamName: string) {
    try {
      const sql = 'UPDATE `team` SET `team_name` = ? WHERE `team_id` = ?';
      await this.connection.query(sql, [teamName, teamId]);
    } catch (err) {
      throw err;
    }
  }

  async getTeamInfoById(teamId: number, userId: number) {
    try {
      this.teams = [];
      const sql = 'SELECT `team`.`team_id`,`team_name`,`organization_id`,`create_time`,`role_id` FROM `team_user` LEFT JOIN `team` ON `team_user`.`team_id`=`team`.`team_id` WHERE `user_id`=? and `team`.`team_id`=?';
      const result: any = await this.connection.query(sql, [userId, teamId]);
      result.info.forEach((team: any) => {
        this.teams.push({
          team_id: team.team_id,
          team_name: team.team_name,
          organization_id: team.organization_id,
          create_time: team.create_time,
          role_id: team.role_id
        });
      });
      if (result.info.length > 0) {
        await this.getTeamMembers(teamId);
      }
    } catch (err) {
      throw err;
    }
  }
  
  async getTeamMembers(teamId: number) {
    try {
      this.members = [];
      const sql = 'SELECT `user`.`user_id`,`role_id`,`username`,`email` FROM `team_user` LEFT JOIN `user` ON `team_user`.`user_id`=`user`.`user_id` WHERE `team_id`=?';
      const result: any = await this.connection.query(sql, [teamId]);
      result.info.forEach((member: any) => {
        this.members.push({
          user_id: member.user_id,
          role_id: member.role_id,
          username: member.username,
          email: member.email
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

  async removeTeam(teamId: number) {
    try {
      await this.connection.transaction(async () => {
        let sql = 'DELETE FROM `team_user` WHERE `team_id` = ?';
        await this.connection.query(sql, [teamId]);
        sql = 'DELETE FROM `team` WHERE `team_id` = ?';
        await this.connection.query(sql, [teamId]);        
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

  async removeUser(teamId: number, userId: number) {
    try {
      const sql = 'DELETE FROM `team_user` WHERE `team_id` = ? AND `user_id` = ?';
      await this.connection.query(sql, [teamId, userId]);
    } catch (err) {
      throw err;
    }
  }

  async setRole(teamId: number, userId: number, roleId: number) {
    try {
      const sql = 'UPDATE `team_user` SET `role_id` = ? WHERE `team_id` = ? AND `user_id` = ?';
      await this.connection.query(sql, [roleId, teamId, userId]);
    } catch (err) {
      throw err;
    }
  }
}