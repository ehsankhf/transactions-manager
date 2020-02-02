import http from 'http';
import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';

import authRouter from './modules/auth/router';
import requestsRouter from './modules/requests/router';
import transactionRouter from './modules/transactions/router';

import mongo from './common/mongo';

const app: Koa = new Koa();
const PORT = 5000;

app.use(bodyParser());
app.use(cors());

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

const server = http.createServer(app.callback());

// Route middleware.
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(requestsRouter.routes());
app.use(requestsRouter.allowedMethods());
app.use(transactionRouter.routes());
app.use(transactionRouter.allowedMethods());

if (process.env.NODE_ENV !== 'test') {
  Promise.all([mongo.connect()]).then(() => {
    app
      .listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
      })
      .on('error', err => {
        console.error(err);
      });
  });
}

export default server;
