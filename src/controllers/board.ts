import { BoardService } from '../services/board';
import { TeamService } from '../services/team';

export class BoardControl {
  boardService: BoardService;
  teamService: TeamService;
  
  constructor() {
    this.boardService = new BoardService();
    this.teamService = new TeamService();
  }

  teamBoards = async (ctx: any) => {
    try {
      const teamId = ctx.params.id;
      if (teamId) {
        const sesion = await this.boardService.getInformation(ctx.session.user_id);
        ctx.session.board = [];
        if(sesion.length) {
          ctx.session.board = sesion;
        }
        const result = await this.boardService.getInformationByTeamId(teamId);
        ctx.body = { succeeded: true, info: 'Get board information successfully.', data: result };
      } else {
        ctx.body = { succeeded: false, info: 'Team id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  boards = async (ctx: any) => {
    try {
      const userId = ctx.session.user_id;
      const result = await this.boardService.getInformation(userId);
      ctx.session.board = [];
      if(result.length) {
        ctx.session.board = result;
      }
      ctx.body = { succeeded: true, info: 'Get board information successfully.', data: result };
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  board = async (ctx: any) => {

  }

  create = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      if (requestBody.boardName && requestBody.teamId) {
        await this.boardService.createBoard(requestBody.boardName, requestBody.teamId);
        ctx.body = { succeeded: true, info: 'Board create successfully.' };
      } else {
        ctx.body = { succeeded: false, info: 'Board name or team id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  update = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      const updatePermission = ctx.session.board.some((board: any) => {
          if (board.board_id == requestBody.boardId) {
            return true;
          }
      }) || false;
      if (requestBody.boardName && requestBody.boardId) {
        if (updatePermission) {
          await this.boardService.updateBoard(requestBody.boardName, requestBody.boardId);
          ctx.body = { succeeded: true, info: 'Board update successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Board name or id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  remove = async (ctx: any) => {
    try {
      const userId = ctx.session.user_id;
      const requestBody = ctx.request.body;
      if (requestBody.boardId) {
        const boards = ctx.session.board;
        let myBoard: any = {};
        boards.some((board: any) => {
          if (board.board_id == requestBody.boardId) {
            myBoard = board;
            return true;
          }
        });
        let myPermissions: string[] = [];
        const teams = await this.teamService.getInformation(userId)
        teams.some(team => {
          if (team.team_id == myBoard.team_id) {
            myPermissions = team.permissions
            return true;
          }
        });
        if (myPermissions.some((permission: string)=> permission==='remove_board')) {
          await this.boardService.removeBoard(requestBody.boardId);
          ctx.body = { succeeded: true, info: 'Board remove successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        } 
      } else {
        ctx.body = { succeeded: false, info: 'Board id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }
}