import { TeamService } from '../services/team';
import { OrganizationService } from '../services/organization';

export class TeamControl {
  teamService: TeamService;
  organizationService: OrganizationService;
  
  constructor() {
    this.teamService = new TeamService();
    this.organizationService = new OrganizationService();
  }

  getTeamPermissions(teams: any, teamId: number) {
    let permissions: string[] = [];
    teams.some((team: any) => {
      if (team.team_id == teamId) {
        permissions = team.permissions;            
        return true;
      }
    });
    return permissions;
  }

  async setSession(ctx: any) {
    const userId = ctx.session.user_id;
    const orgSession = await this.organizationService.getInformation(userId);
    ctx.session.organization = {};
    ctx.session.organization.permissions = orgSession.permissions;
    if(orgSession.id) {
      ctx.session.organization.id = orgSession.id;
      ctx.session.organization.name = orgSession.name;
      ctx.session.organization.email = orgSession.email;
      ctx.session.organization.role = orgSession.role;
    }
    const result = await this.teamService.getInformation(userId);
    ctx.session.team = {};
    if(result.length) {
      ctx.session.team = result;
    }
    return result;
  }

  teams = async (ctx: any) => {
    try {
      const result = await this.setSession(ctx);
      ctx.body = { succeeded: true, info: 'Get team information successfully.', data: result };
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  team = async (ctx: any) => {
    try {
      const userId = ctx.session.user_id;
      const teamId = ctx.params.id;
      this.setSession(ctx);
      const result = await this.teamService.getInformationByTeamId(teamId, userId);
      if (result.team_id) {
        ctx.body = { succeeded: true, info: 'Get team information successfully.', data: result };
      } else {
        ctx.body = { succeeded: false, info: 'Team id error.'};
      }      
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  create = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      const userId = ctx.session.user_id;
      if (requestBody.teamName) {
        const result = await this.teamService.createTeam(requestBody.teamName, ctx.session.organization.id, userId);
        ctx.body = { succeeded: true, info: 'Team create successfully.', data: result };
      } else {
        ctx.body = { succeeded: false, info: 'Team name is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  invite = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      if (requestBody.teamId && requestBody.email) {
        const inviterName = ctx.session.username;
        const teams = ctx.session.team;
        let myTeam: any = {};
        teams.some((team: any) => {
          if (team.team_id == requestBody.teamId) {
            myTeam = team;          
          }
        });
        if (myTeam.permissions.some((permission: string)=> permission==='manage_team_member')) {
          if (myTeam.organization_id) {
            const inviteeOrganization = await this.organizationService.getOrganizationByUserEmail(requestBody.email);
            if (inviteeOrganization.organization_id === myTeam.organization_id) {
              await this.teamService.inviteMember(requestBody.teamId, requestBody.email, myTeam.team_name, inviterName);
              ctx.body = { succeeded: true, info: 'Invite users to join the team successfully.' };
            } else {
              ctx.body = { succeeded: false, info: 'You cannot invite users from outside the organization to join the team.' };
            }
          } else {
            await this.teamService.inviteMember(requestBody.teamId, requestBody.email, myTeam.team_name, inviterName);
            ctx.body = { succeeded: true, info: 'Invite users to join the team successfully.' };
          }          
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Team id or email is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  update = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      if (requestBody.teamId && requestBody.teamName) {
        const permissions = this.getTeamPermissions(ctx.session.team, requestBody.teamId);
        if (permissions.some((permission: string)=> permission==='set_team_info')) {
          await this.teamService.updateTeamInfo(requestBody.teamId, requestBody.teamName);
          ctx.body = { succeeded: true, info: 'Team information update successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Team id or name is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  remove = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      if (requestBody.teamId) {
        const permissions = this.getTeamPermissions(ctx.session.team, requestBody.teamId);
        if (permissions.some((permission: string)=> permission==='remove_team')) {
          await this.teamService.removeTeam(requestBody.teamId);
          ctx.body = { succeeded: true, info: 'Team remove successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Team id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  exit = async (ctx: any) => {
    try {
      const userId = ctx.session.user_id;
      const requestBody = ctx.request.body;
      if (requestBody.teamId) {
        const permissions = this.getTeamPermissions(ctx.session.team, requestBody.teamId);
        if (permissions.some((permission: string)=> permission==='exit_team')) {
          await this.teamService.removeMember(requestBody.teamId, userId);
          ctx.body = { succeeded: true, info: 'Exit team successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Team id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  removeMember = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      if (requestBody.teamId && requestBody.userId) {
        const permissions = this.getTeamPermissions(ctx.session.team, requestBody.teamId);
        if (permissions.some((permission: string)=> permission==='manage_team_member')) {
          await this.teamService.removeMember(requestBody.teamId, requestBody.userId);
          ctx.body = { succeeded: true, info: 'Team member remove successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Team id or user id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  setRole = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      if (requestBody.teamId && requestBody.userId && requestBody.roleId) {
        const permissions = this.getTeamPermissions(ctx.session.team, requestBody.teamId);
        if (permissions.some((permission: string)=> permission==='set_team_admin')) {
          await this.teamService.setRole(requestBody.teamId, requestBody.userId, requestBody.roleId);
          ctx.body = { succeeded: true, info: 'Team member role set successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Team id or user id or role id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }
}