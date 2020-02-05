/* eslint-disable @typescript-eslint/camelcase */

import Koa from 'koa';
import Router from 'koa-router';

import TransactionsRepository from './repository';
import koaJwt from '../../common/koaJwt';
import TrueLayerAPI from '../../common/TrueLayerAPI';
import { TokensCache } from '../../common/TokensCache';
import loadUserFromToken from '../../common/loadUserFromToken';
import { Account } from '../../types/Account';
import { Transaction } from '../../types/Transaction';
import TrueLayerTokenLoader from '../../common/TrueLayerTokenLoader';

const routerOpts: Router.IRouterOptions = {
  prefix: '/transactions'
};

const router: Router = new Router(routerOpts);

function getTransactionsWithUserId(
  transactions: Array<Array<Transaction>>,
  userId: number
): Array<Transaction> {
  return transactions.reduce((acc, transactionsGroup: Array<Transaction>) => {
    return [
      ...acc,
      ...transactionsGroup.map((transaction: Transaction) => ({
        ...transaction,
        user_id: userId
      }))
    ];
  }, []);
}

async function getTransactionsForAllAccounts(
  accessToken: string
): Promise<Array<Array<Transaction>>> {
  const results = await TrueLayerAPI.getAccounts(accessToken);
  return Promise.all(
    results.map((accountInfo: Account) =>
      TrueLayerAPI.getTransactions(accessToken, accountInfo.account_id)
    )
  );
}

router.get(
  '/',
  koaJwt,
  loadUserFromToken,
  TrueLayerTokenLoader,
  async (ctx: Koa.Context) => {
    const { user } = ctx;

    const tokenInfo = TokensCache.get(String(user.id));
    let transactionsWithUser: Array<Transaction> = [];

    if (tokenInfo) {
      transactionsWithUser = await TransactionsRepository.getAll(user.id);
      if (transactionsWithUser.length === 0) {
        const transactions: Array<Array<
          Transaction
        >> = await getTransactionsForAllAccounts(tokenInfo.access_token);

        transactionsWithUser = getTransactionsWithUserId(transactions, user.id);
        await TransactionsRepository.addAll(transactionsWithUser);
      }
    }

    ctx.body = {
      data: transactionsWithUser
    };
  }
);

export default router;
