const Router = require('koa-router')

import { MainControl } from '../controllers';
import { UserRouter } from './user';
import { OrganizationRouter } from './organization';
import { PermissionRouter } from './permission';

export class MainRouter {
  router = new Router();
  
  constructor() {
    let home = new Router();
    let mainContorl = new MainControl();
    let userRouter = new UserRouter();
    let organizationRouter = new OrganizationRouter();
    let permissionRouter = new PermissionRouter();
    home.get('/', mainContorl.main);
    this.router.use('/', home.routes(), home.allowedMethods());
    this.router.use('/user', userRouter.router.routes(), userRouter.router.allowedMethods());
    this.router.use('/org', organizationRouter.router.routes(), organizationRouter.router.allowedMethods());
    this.router.use('/permission', permissionRouter.router.routes(), permissionRouter.router.allowedMethods())
  }
}