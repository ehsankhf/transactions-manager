import supertest from 'supertest';
import { expect } from 'chai';
import 'mocha';

import server from '../../server';
import commonTest from '../../common/test';
import bcrypt from 'bcrypt';
import UsersRepository from '../auth/repository';

const request = supertest(server);

describe('Transactions', () => {
  beforeEach(async () => {
    await commonTest.createMySqlDB();
    return commonTest.cleanMySqlDB();
  });
  afterEach(async () => {
    server.close();
  });

  it('should receive the expected response', async () => {
    const pass = await bcrypt.hash('myPassword', 10);
    await UsersRepository.addOne({
      username: 'ehsan@ehsan.com',
      password: pass
    });
    let res = await request
      .post('/auth/login')
      .send({ username: 'ehsan@ehsan.com', password: 'myPassword' });

    res = await request
      .get('/transactions')
      .set({ Authorization: `Bearer ${res.body.token}` });
    expect(res.body.data).to.deep.equal([{}]);
  });
});
