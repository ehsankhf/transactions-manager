import Koa from 'koa';
import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validate from 'validate.js';

import TrueLayerAPI from '../../common/TrueLayerAPI';
import { TokensCache } from '../../common/TokensCache';
import UsersRepository from './repository';

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
  const code: string = ctx.request.query.code;

  const response = await TrueLayerAPI.exchangeCode(code);
  TokensCache.set(response.access_token, response);

  ctx.redirect('http://localhost:3000/login');
});

router.post('/login', async (ctx: Koa.Context) => {
  const { username, password } = ctx.request.body;
  const validation = validate({ username, password }, constraints);

  if (!validation) {
    const user = await UsersRepository.getOneByUsername(username);
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      console.log(user, result);
      if (result) {
        ctx.status = 200;
        ctx.body = {
          token: jwt.sign({ username }, process.env.JWT_SECRET || 'test'),
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
      await UsersRepository.addOne({ username, password });

      ctx.status = 200;
      ctx.body = {
        token: jwt.sign({ username }, process.env.JWT_SECRET || 'test'),
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
