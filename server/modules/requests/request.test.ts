import supertest from 'supertest';
import { expect } from 'chai';
import 'mocha';

import server from '../../server';

const request = supertest(server);

describe('Requests', () => {
  it('should receive the expected response', async () => {
    const res = await request.get('/requests');
    expect(res.body.data).to.deep.equal([]);
  });
});
