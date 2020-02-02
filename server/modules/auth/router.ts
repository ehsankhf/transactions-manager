import Koa from 'koa';
import Router from 'koa-router';
import jwt from 'koa-jwt';


import TrueLayerAPI from '../../common/TrueLayerAPI';
import { TokensCache } from '../../common/TokensCache';

const routerOpts: Router.IRouterOptions = {
  prefix: '/auth'
};

const router: Router = new Router(routerOpts);

router.get('/callback', async (ctx: Koa.Context) => {
  const code: string = ctx.request.query.code;

  const response = await TrueLayerAPI.exchangeCode(code);
  TokensCache.set(response.access_token, response);

  ctx.redirect('http://localhost:3000/login');
});

router.post('/login', async (ctx: Koa.Context) => {
  // TODO: add the user check
  if (ctx.request.body.password === 'password') {
    ctx.status = 200;
    ctx.body = {
      token: jwt.sign({ role: 'admin' }, 'A very secret key'), //Should be the same secret key as the one used is ./jwt.js
      message: "Successfully logged in!"
    };
  } else {
    ctx.status = ctx.status = 401;
    ctx.body = {
      message: "Authentication failed"
    };
  }
  return ctx;
});

router.post('/register', async (ctx: Koa.Context) => {
  // TODO: add the user registration
  return ctx;
});

export default router;
