import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';

import { MainRouter } from './app/main';

const app = new Koa();
const mainRouter = new MainRouter(); 

app.keys = ['some secret hurr'];
 
const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true
};

app.use(session(CONFIG, app));  // 加载session中间件
app.use(bodyParser());  // 加载post请求数据解析中间件
app.use(mainRouter.router.routes()).use(mainRouter.router.allowedMethods());  // 加载路由中间件

app.listen(3000, () => {
    console.log('route-use-middleware is starting at port 3000');
});