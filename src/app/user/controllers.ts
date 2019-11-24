import { DB } from 'none-sql';
import md5 from 'md5';

interface Result {
    succeed: boolean,
    info: string,
    obj?: any
}

export class UserContorl {
    db: DB;
    constructor() {
        this.db = new DB('team_cooperation', 'root', '', 'localhost');
    }

    getUserByName(username: string) {
        let result = this.db.connect('users').where({username: username}).get();
        result.then((data: any) => {
            return data[0];
        }).catch((err) => {
            throw err;
        });
    }

    login = async (ctx: any) => {
        try {
            let requestBody = ctx.request.body;
            if (requestBody.username && requestBody.password) {
                let user = (await this.db.connect('users').where({username: requestBody.username}).get()).info[0];
                if (user.password === md5(requestBody.password + 'wOkkLtKMaXA9MIZq')) {
                    ctx.session.username = user.username;
                    ctx.body = { succeed: true, info: 'Login successfully.'};
                } else {
                    ctx.body = { succeed: false, info: 'Username or password is error.'};
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
            if (requestBody.password === requestBody.passwordAttirm) {
                const result = await this.db.connect('users').add([{
                    username: requestBody.username,
                    password: md5(requestBody.password + 'wOkkLtKMaXA9MIZq')
                }]);
                ctx.body = { succeed: true, info: 'Register successfully.', obj: result };
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