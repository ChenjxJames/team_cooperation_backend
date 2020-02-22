import Router from 'koa-router';
import { PermissionControl } from '../controllers/permission';

export class PermissionRouter {

  router = new Router();

  constructor(){ 
    let contorl = new PermissionControl();
    this.router
    .get('/', contorl.allRolePermissions);
  }
}