import Router from 'koa-router';
import { UserControl } from '../controllers/user';

export class UserRouter {

    router = new Router();

    constructor(){ 
        let contorl = new UserControl();
        this.router
        .post('/login', contorl.login)
        .post('/register', contorl.register)
        .get('/logout', contorl.logout);
    }
    

}