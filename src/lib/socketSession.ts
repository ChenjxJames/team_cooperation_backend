export function HandleKoaSession (app: any, opt: any) {
  const store = opt.store;
  const key = opt.key || 'koa:sess';
  return async function(socket: any, next: any) {
      if (!socket.handshake.headers.cookie) {
          return next(new Error('no cookie'));
      }
      const ctx = app.createContext(socket.request, socket.response);
      const sid = ctx.cookies.get(key, opt);
      socket.session = await store.get(sid);
      await next();
  };
}