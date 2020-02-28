import Router from 'koa-router';
import { TeamControl } from '../controllers/team';

export class TeamRouter {

  router = new Router();

  constructor(){ 
    let contorl = new TeamControl();
    this.router
    .post('/create', contorl.create)
    .post('/invite', contorl.invite)
    .get('/', contorl.information);
  }
}