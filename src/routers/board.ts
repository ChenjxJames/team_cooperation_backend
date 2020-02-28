import Router from 'koa-router';
import { BoardControl } from '../controllers/board';

export class BoardRouter {

  router = new Router();

  constructor(){ 
    let contorl = new BoardControl();
    this.router
    .post('/create', contorl.create)
    .post('/join', contorl.join)
    .get('/', contorl.information);
  }
}