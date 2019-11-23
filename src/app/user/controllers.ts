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

    async login(ctx: any) {
        try {
            let requestBody = ctx.request.body;
            if (requestBody.username && requestBody.password) {
                const result = this.db.connect('users').where({username: requestBody.username}).get(); 
                result.then((data: any) => {
                    if (data[0].password === md5(requestBody.password + 'wOkkLtKMaXA9MIZq')) {
                        ctx.session.username = data[0].username;
                        ctx.body = { succeed: true, info: 'Login successfully.'};
                    } else {
                        ctx.body = { succeed: false, info: 'Username or password is error.'};
                    }                
                }).catch((err) => {
                    ctx.body = { succeed: false, info: 'Login error.', obj: err };
                });
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
                // result.then((data) => {
                //     ctx.body = { succeed: true, info: 'Register successfully.', obj: data };
                // }).catch((err) => {
                //     ctx.body = { succeed: false, info: 'Please try again after changing the username.', obj: err };
                // });
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