import { TeamService } from '../services/team';

export class TeamControl {
  teamService: TeamService;
  
  constructor() {
    this.teamService = new TeamService();
  }

  information = async (ctx: any) => {
    try {
      const userId = ctx.session.user_id;
      const result = await this.teamService.getInformation(userId);
      ctx.session.team = {};
      if(result.length) {
        ctx.session.team = result;
      }
      ctx.body = { succeeded: true, info: 'Get team information successfully.', data: result };
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  create = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      const userId = ctx.session.user_id;
      if (requestBody.name) {
        await this.teamService.createTeam(requestBody.name, ctx.session.organization.id, userId);
        ctx.body = { succeeded: true, info: 'Team create successfully.' };
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
        const teams = ctx.session.team;
        let permissions: string[] = [];
        teams.some((team: any) => {
          if (team.team_id == requestBody.teamId) {
            permissions = team.permissions;            
          }
        });
        if (permissions.some((permission: string)=> permission==='manage_team_member')) {
          await this.teamService.inviteMember(requestBody.teamId, requestBody.email);
          ctx.body = { succeeded: true, info: 'Invite users to join the team successfully.' };;
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

}