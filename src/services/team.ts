import { TeamImpl } from "../models/team";
import { Permission } from "../models/permission";
import Mail from "../lib/mail";

export class TeamService {
  team: TeamImpl;
  permission : Permission;

  constructor() {
    this.team = new TeamImpl();
    this.permission = new Permission();
  }

  async getInformation(userId: number) {
    try {      
      await this.team.getTeamInfo(userId);const allRolePermissions = await this.permission.getAllRolePermissions();
      const result: any[] = [];
      this.team.teams.forEach((team: any) => {
        result.push({
          team_id: team.team_id,
          team_name: team.team_name,
          organization_id: team.organization_id,
          create_time: team.create_time,
          role_id: team.role_id,
          permissions: allRolePermissions[team.role_id].permissions
        });
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getInformationByTeamId(teamId: number, userId: number) {
    try {
      await this.team.getTeamInfoById(teamId, userId);
      const result: any = {
        ...this.team.teams[0],
        members: this.team.members
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async createTeam(teamName: string, organizationId: number, userId: number) {
    try {
      return await this.team.createTeam(teamName, organizationId, userId);
    } catch (err) {
      throw err;
    }
  }

  async removeTeam(teamId: number) {
    try {
      await this.team.removeTeam(teamId);
    } catch (err) {
      throw err;
    }
  }

  async inviteMember(teamId: number, email: string, teamName: string, inviterName: string) {
    try {
      await this.team.addUser(teamId, email, 6);
      const mail = new Mail();
      await mail.sendInform(email, `已加入${teamName}`, `您已在管理员${inviterName}的邀请下加入本团队。`);
    } catch (err) {
      throw err;
    }
  }

  async updateTeamInfo(teamId: number, teamName: string) {
    try {
      await this.team.updateTeamInfo(teamId, teamName);
    } catch (err) {
      throw err;
    }
  }

  async removeMember(teamId: number, userId: number) {
    try {
      await this.team.removeUser(teamId, userId);
    } catch (err) {
      throw err;
    }
  }

  async setRole(teamId: number, userId: number, roleId: number) {
    try {
      await this.team.setRole(teamId, userId, roleId);
    } catch (err) {
      throw err;
    }
  }
}