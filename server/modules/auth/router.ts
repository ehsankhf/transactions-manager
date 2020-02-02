import Koa from 'koa';
import Router from 'koa-router';

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

export default router;
