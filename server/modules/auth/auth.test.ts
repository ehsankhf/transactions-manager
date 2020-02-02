import supertest from 'supertest';
import { expect } from 'chai';
import 'mocha';

import server from '../../server';

const request = supertest(server);

describe('Auth', () => {
  it('should receive the expected response', async () => {
    const res = await request.get('/auth/callback');
    expect(res.body.data).to.deep.equal([{}]);
  });
});
