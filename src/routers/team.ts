import Router from 'koa-router';
import { TeamControl } from '../controllers/team';

export class TeamRouter {

  router = new Router();

  constructor(){ 
    let contorl = new TeamControl();
    this.router
    .post('/create', contorl.create)
    .post('/invite', contorl.invite)
    .post('/update', contorl.update)
    .post('/remove', contorl.remove)
    .post('/removeMember', contorl.removeMember)
    .post('/exit', contorl.exit)
    .post('/setRole', contorl.setRole)
    .get('/', contorl.teams)
    .get('/:id', contorl.team);
  }
}