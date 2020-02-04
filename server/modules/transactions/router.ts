import Koa from 'koa';
import Router from 'koa-router';

import TransactionsRepository from './repository';
import koaJwt from '../../common/koaJwt';

const routerOpts: Router.IRouterOptions = {
  prefix: '/transactions'
};

const router: Router = new Router(routerOpts);

router.get('/', koaJwt, async (ctx: Koa.Context) => {
  /* eslint-disable @typescript-eslint/camelcase */
  const transactions = [
    {
      timestamp: '2020-02-02T00:00:00+00:00',
      description: 'MR JOHN SMITH',
      transaction_type: 'CREDIT',
      transaction_category: 'TRANSFER',
      transaction_classification: ['1'],
      amount: 30,
      currency: 'GBP',
      transaction_id: '16ae0ca75e166585597f0d9d98343eb2',
      running_balance: { currency: 'GBP', amount: 661.32 },
      meta: { provider_transaction_category: 'TFR' }
    }
  ];

  const results = await TransactionsRepository.addAll(transactions);

  ctx.body = {
    data: results
  };
});

export default router;
