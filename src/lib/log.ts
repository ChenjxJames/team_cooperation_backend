const log = async (ctx: any, next: any) => {
  const url = ctx.url;
  const pathname = url.split('?')[0];
  console.log((new Date()).toLocaleString(), 'userID_'+ctx.session.user_id, ctx.request.method, pathname);
  await next();
}

export default log;