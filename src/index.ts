import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';

import { MainRouter } from './routers/main';
import { SESSION_CONFIG, MYSQL_CONFIG } from './config/db';
import { RUN_CONFIG } from './config/index';
import { Pool } from 'none-sql';

const app = new Koa();
const mainRouter = new MainRouter(); 

app.keys = ['some secret hurr'];

const pool = new Pool(
    MYSQL_CONFIG.dbname, 
    MYSQL_CONFIG.username, 
    MYSQL_CONFIG.password, 
    MYSQL_CONFIG.host, 
    MYSQL_CONFIG.connectionLimit
);

app.use(
    async (ctx: any, next: any) => {
        ctx.request.db = await pool.getConnection();
        await next();
        ctx.request.db.connection.release();
    }
);
app.use(session(SESSION_CONFIG, app));  // 加载session中间件
app.use(bodyParser());  // 加载post请求数据解析中间件
app.use(mainRouter.router.routes()).use(mainRouter.router.allowedMethods());  // 加载路由中间件

app.listen(RUN_CONFIG.port, () => {
    console.log(`route-use-middleware is starting at port ${RUN_CONFIG.port}`);
});