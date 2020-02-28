const Router = require('koa-router')

import { MainControl } from '../controllers';
import { UserRouter } from './user';
import { OrganizationRouter } from './organization';
import { PermissionRouter } from './permission';
import { BoardRouter } from './board';
import { TeamRouter } from './team';

export class MainRouter {
  router = new Router();
  
  constructor() {
    let home = new Router();
    let mainContorl = new MainControl();
    let userRouter = new UserRouter();
    let organizationRouter = new OrganizationRouter();
    let permissionRouter = new PermissionRouter();
    let boardRouter = new BoardRouter();
    let teamRouter = new TeamRouter();
    home.get('/', mainContorl.main);
    this.router.use('/', home.routes(), home.allowedMethods());
    this.router.use('/user', userRouter.router.routes(), userRouter.router.allowedMethods());
    this.router.use('/org', organizationRouter.router.routes(), organizationRouter.router.allowedMethods());
    this.router.use('/team', teamRouter.router.routes(), teamRouter.router.allowedMethods());
    this.router.use('/permission', permissionRouter.router.routes(), permissionRouter.router.allowedMethods());
    this.router.use('/board', boardRouter.router.routes(), boardRouter.router.allowedMethods());
  }
}