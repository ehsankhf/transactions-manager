import { koaJwt } from 'koa-jwt';

export default koaJwt({
  secret: process.env.JWT_SECRET
});
