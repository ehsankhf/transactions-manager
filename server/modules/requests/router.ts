import Koa from 'koa';
import Router from 'koa-router';
import koaJwt from '../../common/koaJwt';

const routerOpts: Router.IRouterOptions = {
  prefix: '/requests'
};

const router: Router = new Router(routerOpts);

router.get('/', koaJwt, async (ctx: Koa.Context) => {
  ctx.body = {
    data: [{}]
  };
});

export default router;
