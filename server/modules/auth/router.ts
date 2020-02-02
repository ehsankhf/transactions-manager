import Koa from 'koa';
import Router from 'koa-router';

const routerOpts: Router.IRouterOptions = {
  prefix: '/auth'
};

const router: Router = new Router(routerOpts);

router.get('/callback', async (ctx: Koa.Context) => {
  ctx.body = {
    data: [{}]
  };
});

export default router;
