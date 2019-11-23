import Router from 'koa-router';
import { UserContorl } from './controllers';

export class UserRouter {

    router = new Router();

    constructor(){ 
        let contorl = new UserContorl();
        this.router
        .post('/login', contorl.login)
        .post('/register', contorl.register)
        .get('/logout', contorl.logout);
    }
    

}