/* eslint-disable @typescript-eslint/camelcase */

import supertest from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import 'mocha';

import server from '../../server';
import TrueLayerAPI from '../../common/TrueLayerAPI';
import {TokensCache} from "../../common/TokensCache";

const request = supertest(server);

describe.only('Auth', () => {
  it('should receive the expected response', async () => {
    const exchangeCodeStub = sinon.stub(TrueLayerAPI, 'exchangeCode').returns(
      Promise.resolve({
        access_token: 'JWT-ACCESS-TOKEN-HERE',
        expires_in: 'JWT-EXPIRY-TIME',
        token_type: 'Bearer',
        refresh_token: 'REFRESH-TOKEN-HERE'
      })
    );

    const res = await request.get('/auth/callback');
    expect(TokensCache.get(`JWT-ACCESS-TOKEN-HERE`)).to.deep.equal({
      access_token: 'JWT-ACCESS-TOKEN-HERE',
      expires_in: 'JWT-EXPIRY-TIME',
      token_type: 'Bearer',
      refresh_token: 'REFRESH-TOKEN-HERE'
    });
    exchangeCodeStub.restore();
  });
});
