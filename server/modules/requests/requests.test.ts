/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import supertest from 'supertest';
import { expect } from 'chai';
import bcrypt from 'bcrypt';
import 'mocha';

import server from '../../server';

import commonTest from '../../common/test';
import mongo from '../../common/mongo';
import { RequestsRepository } from './repository';
import UsersRepository from '../auth/repository';
import { TokensCache } from '../../common/TokensCache';

const request = supertest(server);

describe('RequestsRepository', () => {
  beforeEach(async () => {
    TokensCache.clear();
    await mongo.connect();
    await mongo.removeAll();
    await commonTest.createMySqlDB();
    return commonTest.cleanMySqlDB();
  });

  afterEach(async () => {
    await mongo.removeAll();
    await mongo.disconnect();
    server.close();
  });

  it('should fail if the user is not registered', async () => {
    const authRes = await request
      .post('/auth/login')
      .send({ username: 'ehsan1@ehsan.com', password: 'myPassword' });
    expect(authRes.body).to.deep.equal({ message: 'Authentication failed' });

    const requests: any = await RequestsRepository.getAll();
    expect(requests.length).to.equal(1);
    expect(requests[0].status).to.equal(401);
    expect(requests[0].url).to.include('/auth/login');
    expect(requests[0].response).to.deep.eq({
      message: 'Authentication failed'
    });
  });

  it('should NOT fail if the user is registered', async () => {
    const pass = await bcrypt.hash('myPassword', 10);
    await UsersRepository.addOne({
      username: 'ehsan@ehsan.com',
      password: pass
    });
    const authRes = await request
      .post('/auth/login')
      .send({ username: 'ehsan@ehsan.com', password: 'myPassword' });
    expect(authRes.status).to.eq(200);

    const reqRes: any = await request
      .get('/requests')
      .set({ Authorization: `Bearer ${authRes.body.token}` });

    expect(reqRes.body.data.length).to.equal(1);
    expect(reqRes.body.data[0].status).to.equal(200);
    expect(reqRes.body.data[0].url).to.include('/auth/login');
  });
});
