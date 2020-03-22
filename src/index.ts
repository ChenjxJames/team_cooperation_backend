import Koa from 'koa';
import socketIo from 'socket.io';
import http from 'http';
import { createServer } from 'http';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';

import { MainRouter } from './routers/main';
import { SESSION_CONFIG, MYSQL_CONFIG } from './config/db';
import { RUN_CONFIG } from './config/index';
import { MySqlPool } from './lib/mysql';
import loginFilter from './lib/loginFilter';
import log from './lib/log';
import Socket from './socket/main';
import { HandleKoaSession } from './lib/socketSession';

MySqlPool.init(MYSQL_CONFIG);  // 初始化数据连接池

const app = new Koa();
const server: http.Server = createServer(app.callback());
const mainRouter = new MainRouter();

app.keys = ['vEiC37Y8CtJPh6Q6'];

app.use(session(SESSION_CONFIG, app));  // 加载session中间件
app.use(bodyParser());  // 加载post请求数据解析中间件
app.use(log);  // 加载日志中间件
app.use(loginFilter);  // 加载登录验证拦截器中间件
app.use(mainRouter.router.routes()).use(mainRouter.router.allowedMethods());  // 加载路由中间件

const io = socketIo(server, { cookie: true });
new Socket(io, HandleKoaSession(app, SESSION_CONFIG));

server.listen(RUN_CONFIG.port, () => {
  console.info(`route-use-middleware is starting at port ${RUN_CONFIG.port}`);
});