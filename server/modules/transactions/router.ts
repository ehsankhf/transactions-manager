import Koa from 'koa';
import Router from 'koa-router';

const routerOpts: Router.IRouterOptions = {
  prefix: '/transactions'
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = {
    data: [{}]
  };
});

export default router;
