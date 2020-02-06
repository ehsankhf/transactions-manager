import Koa from 'koa';
import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validate from 'validate.js';

import TrueLayerAPI from '../../common/TrueLayerAPI';
import { TokensCache } from '../../common/TokensCache';
import UsersRepository from './repository';
import koaJwt from '../../common/KoaJwt';
import loadUserFromToken from '../../common/LoadUserFromToken';
import { Token } from '../../types/Token';

const constraints = {
  username: {
    presence: true,
    email: true
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: 'must be at least 8 characters'
    }
  }
};

const routerOpts: Router.IRouterOptions = {
  prefix: '/auth'
};

const router: Router = new Router(routerOpts);

router.get('/callback', async (ctx: Koa.Context) => {
  const { code, state } = ctx.request.query;

  const response: Token = await TrueLayerAPI.exchangeCode(code);
  response.expiresAtMs = new Date().getTime() + 2 * 1000;
  TokensCache.set(state, response);

  ctx.body = {
    message: 'Token is set successfully'
  };
});

router.get('/setToken', koaJwt, loadUserFromToken, async (ctx: Koa.Context) => {
  ctx.redirect(process.env.TRUE_LAYER_AUTH_LINK + '&state=' + 1);
});

router.post('/login', async (ctx: Koa.Context) => {
  const { username, password } = ctx.request.body;
  const validation = validate({ username, password }, constraints);

  if (!validation) {
    const user = await UsersRepository.getOneByUsername(username);
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        ctx.status = 200;
        ctx.body = {
          token: jwt.sign(
            { username, id: user.id },
            process.env.JWT_SECRET || 'test'
          ),
          message: 'Successfully logged in!'
        };
        return;
      }
    }
  }

  ctx.status = ctx.status = 401;
  ctx.body = {
    message: 'Authentication failed'
  };
});

router.post('/register', async (ctx: Koa.Context) => {
  const { username, password } = ctx.request.body;

  const validation = validate({ username, password }, constraints);

  if (!validation) {
    const user = await UsersRepository.getOneByUsername(username);
    if (!user) {
      const pass = await bcrypt.hash(password, 10);
      await UsersRepository.addOne({ username, password: pass });

      ctx.status = 200;
      ctx.body = {
        message: 'Successfully registered!'
      };
      return;
    }
  }

  ctx.status = ctx.status = 400;
  ctx.body = {
    message: 'Registration failed'
  };
});

export default router;
