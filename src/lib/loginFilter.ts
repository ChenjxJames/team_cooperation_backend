import { AVOID_LOGIN } from '../config/router';

const loginFilter = async (ctx: any, next: any) => {
  const url = ctx.url;
  const pathname = url.split('?')[0];
  let userId = ctx.session.user_id;
  if(AVOID_LOGIN.indexOf(pathname) > -1 || userId) {
    await next();
  } else {
    ctx.body = { succeeded: false, info: 'Please login.' };
  }  
}

export default loginFilter;