import Router from 'koa-router';
import { BoardControl } from '../controllers/board';

export class BoardRouter {

  router = new Router();

  constructor(){ 
    let contorl = new BoardControl();
    this.router
    .post('/create', contorl.create)
    .post('/remove', contorl.remove)
    .post('/update', contorl.update)
    .get('/team/:id', contorl.teamBoards)
    .get('/', contorl.boards)
    .get('/:id', contorl.board);
  }
}