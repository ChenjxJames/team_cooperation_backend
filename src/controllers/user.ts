import md5 from 'md5';
import { UserImpl } from '../models/user';

interface Result {
    succeed: boolean,
    info: string,
    obj?: any
}

export class UserControl {
    salt = 'wOkkLtKMaXA9MIZq'

    login = async (ctx: any) => {
        try {
            let requestBody = ctx.request.body;
            if (requestBody.username && requestBody.password) {
                let user = new UserImpl(ctx.request.db);
                await user.getUserByUsername(requestBody.username);
                if (user.password === md5(requestBody.password + this.salt)) {
                    ctx.session.username = user.username;
                    ctx.body = { succeed: true, info: 'Login successfully.' };
                } else {
                    ctx.body = { succeed: false, info: 'Username or password is error.' };
                }
            } else {
                ctx.body = { succeed: false, info: 'Username or password is null.' };
            }
        } catch (err) {
            ctx.body = { succeed: false, info: 'Server error.', obj: err };
        }

    }

    register = async (ctx: any) => {
        try {
            let requestBody = ctx.request.body
            if (requestBody.password === requestBody.passwordAffirm && requestBody.username && requestBody.email) {
                let user = new UserImpl(ctx.request.db);
                user.username = requestBody.username;
                user.password = md5(requestBody.password + this.salt);
                user.email = requestBody.email;
                user.save()
                ctx.body = { succeed: true, info: 'Register successfully.' };
            } else {
                ctx.body = { succeed: false, info: 'Password attirm error.' };
            }
        } catch (err) {
            ctx.body = { succeed: false, info: 'Server error.', obj: err };
        }
    }

    logout = async (ctx: any) => {
        ctx.session.username = null;
        ctx.body = 'logout page!';
    }
}