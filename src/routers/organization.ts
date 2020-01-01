import Router from 'koa-router';
import { OrganizationControl } from '../controllers/organization';

export class OrganizationRouter {

  router = new Router();

  constructor(){ 
    let contorl = new OrganizationControl();
    this.router
    .post('/create', contorl.create)
    .post('/update', contorl.update)
    .get('/delete', contorl.delete);
  }
}