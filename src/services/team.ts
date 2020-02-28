import { TeamImpl } from "../models/team";
import { Permission } from "../models/permission";

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

  async createTeam(name: string, organizationId: number, userId: number) {
    try {
      await this.team.createTeam(name, organizationId, userId);
    } catch (err) {
      throw err;
    }
  }

  async inviteMember(teamId: number, email: string) {
    try {
      await this.team.addUser(teamId, email, 6);
    } catch (err) {
      throw err;
    }
  }
}