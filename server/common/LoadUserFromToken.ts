import jwt from 'jsonwebtoken';
import Koa from 'koa';

export default async (ctx: Koa.Context, next: () => Promise<any>) => {
  if (
    ctx.headers &&
    ctx.headers.authorization &&
    ctx.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    try {
      ctx.user = await jwt.verify(
        ctx.headers.authorization.split(' ')[1],
        process.env.JWT_SECRET || 'test'
      );

      return next();
    } catch (err) {
      // NO-OP
    }
  }
  ctx.status = ctx.status = 401;
  ctx.body = {
    message: 'Authentication failed'
  };
  return;
};
