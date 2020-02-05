/* eslint-disable @typescript-eslint/ban-ts-ignore */

import Koa from 'koa';
import { TokensCache } from './TokensCache';
import TrueLayerAPI from './TrueLayerAPI';
import { Token } from '../types/Token';

export default async (ctx: Koa.Context, next: () => Promise<any>) => {
  if (ctx.user && ctx.user.id && TokensCache.has(String(ctx.user.id))) {
    // @ts-ignore
    let token: Token = TokensCache.get(String(ctx.user.id));
    if (token) {
      if (token.expiresAtMs < new Date().getTime()) {
        token = await TrueLayerAPI.renewToken(token.refresh_token);
        TokensCache.set(ctx.user.id, token);
      }
      ctx.trueLayerToken = token.access_token;
      return next();
    }
  }
  ctx.status = 401;
  ctx.body = {
    message: 'Please request for setting the token'
  };
  return;
};
