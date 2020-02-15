import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';

import { MainRouter } from './routers/main';
import { SESSION_CONFIG, MYSQL_CONFIG } from './config/db';
import { RUN_CONFIG } from './config/index';
import { MySqlPool } from './lib/MySql';
import loginFilter from './lib/loginFilter';


const app = new Koa();
const mainRouter = new MainRouter();
new MySqlPool(MYSQL_CONFIG);  // 初始化数据连接池

app.keys = ['some secret hurr'];

app.use(session(SESSION_CONFIG, app));  // 加载session中间件
app.use(bodyParser());  // 加载post请求数据解析中间件
app.use(loginFilter);  // 登录验证
app.use(mainRouter.router.routes()).use(mainRouter.router.allowedMethods());  // 加载路由中间件

app.listen(RUN_CONFIG.port, () => {
  console.log(`route-use-middleware is starting at port ${RUN_CONFIG.port}`);
});