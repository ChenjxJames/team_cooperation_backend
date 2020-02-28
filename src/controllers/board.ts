import { BoardService } from '../services/board';

export class BoardControl {
  boardService: BoardService;
  
  constructor() {
    this.boardService = new BoardService();
  }

  information = async (ctx: any) => {
    try {
      const userId = ctx.session.user_id;
      const result = await this.boardService.getInformation(userId);
      ctx.session.board = {};
      if(result.length) {
        ctx.session.board = result;
      }
      ctx.body = { succeeded: true, info: 'Get board information successfully.', data: result };
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
        await this.boardService.createUserBoard(requestBody.name, userId);
        ctx.body = { succeeded: true, info: 'Board create successfully.' };
      } else {
        ctx.body = { succeeded: false, info: 'Board name is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  join = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      const userId = ctx.session.user_id;
      if (requestBody.id) {
        await this.boardService.joinBoard(requestBody.id, userId);
        ctx.body = { succeeded: true, info: 'Join board successfully.' };
      } else {
        ctx.body = { succeeded: false, info: 'Board id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

}