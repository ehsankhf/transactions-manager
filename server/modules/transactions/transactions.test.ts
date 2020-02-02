import supertest from 'supertest';
import { expect } from 'chai';
import 'mocha';

import server from '../../server';
import commonTest from '../../common/test';

const request = supertest(server);

describe('Requests', () => {
  beforeEach(async () => {
    await commonTest.createMySqlDB();
    return commonTest.cleanMySqlDB();
  });
  afterEach(async () => {
    server.close();
  });

  it('should receive the expected response', async () => {
    const res = await request.get('/transactions');
    expect(res.body.data).to.deep.equal([{}]);
  });
});
