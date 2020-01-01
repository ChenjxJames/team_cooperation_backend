import Router from 'koa-router';
import { UserControl } from '../controllers/user';

export class UserRouter {

  router: Router;
  userControl: UserControl;

  constructor(){ 
    this.router = new Router();
    this.userControl = new UserControl();
    this.router
    .post('/login', this.userControl.login)
    .post('/register', this.userControl.register)
    .post('/changePassword', this.userControl.changePassword)
    .post('/forgetPassword', this.userControl.forgetPassword)
    .post('/resetPassword', this.userControl.resetPassword)
    .post('/getUserInfoById', this.userControl.getUserInfoById)
    .post('/getUsernameById', this.userControl.getUsernameById)
    .get('/logout', this.userControl.logout);
  }
  
}