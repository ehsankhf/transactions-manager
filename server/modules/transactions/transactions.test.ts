/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import supertest from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import 'mocha';

import server from '../../server';
import commonTest from '../../common/test';
import bcrypt from 'bcrypt';
import UsersRepository from '../auth/repository';
import TrueLayerAPI from '../../common/TrueLayerAPI';
import { TokensCache } from '../../common/TokensCache';
import { Transaction } from '../../types/Transaction';

const request = supertest(server);

describe('Transactions', () => {
  beforeEach(async () => {
    await commonTest.createMySqlDB();
    await commonTest.cleanMySqlDB();
    TokensCache.clear();
  });
  afterEach(async () => {
    server.close();
  });

  describe('when the TrueLayer token exists', () => {
    let getAccountsStub: sinon.SinonStub<[string], Promise<any>>;
    let getTransactionsStub: sinon.SinonStub<[string, string], Promise<any>>;

    beforeEach(async () => {
      const expirationSec = 232222;
      const pass = await bcrypt.hash('myPassword', 10);
      await UsersRepository.addOne({
        id: 2020,
        username: 'ehsan@ehsan.com',
        password: pass
      });
      TokensCache.set('2020', {
        access_token: '1111111111',
        expires_in: expirationSec,
        token_type: 'sa',
        refresh_token: 'sa',
        expiresAtMs: new Date().getTime() + expirationSec * 1000
      });
      getAccountsStub = sinon
        .stub(TrueLayerAPI, 'getAccounts')
        .returns(Promise.resolve([{ account_id: '111' }]));

      getTransactionsStub = sinon
        .stub(TrueLayerAPI, 'getTransactions')
        .returns(
          Promise.resolve([{ transaction_id: '111' }, { transaction_id: '22' }])
        );
    });

    afterEach(() => {
      getAccountsStub.restore();
      getTransactionsStub.restore();
    });

    it("should receive the list of transactions when the api's JWT token exists", async () => {
      let res = await request
        .post('/auth/login')
        .send({ username: 'ehsan@ehsan.com', password: 'myPassword' });

      res = await request
        .get('/transactions')
        .set({ Authorization: `Bearer ${res.body.token}` });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        data: [
          {
            transaction_id: '111',
            user_id: 2020
          },
          {
            transaction_id: '22',
            user_id: 2020
          }
        ]
      });
    });

    it("should not receive the list of transactions when the api's JWT token does not exist", async () => {
      const res = await request
        .get('/transactions')
        .set({ Authorization: `Bearer` });

      expect(res.status).to.equal(401);
    });
  });

  describe('when the TrueLayer token does not exist', () => {
    let getAccountsStub: sinon.SinonStub<[string], Promise<any>>;
    let getTransactionsStub: sinon.SinonStub<[string, string], Promise<any>>;

    beforeEach(async () => {
      const expirationSec = 232222;
      const pass = await bcrypt.hash('myPassword', 10);
      await UsersRepository.addOne({
        id: 2020,
        username: 'ehsan@ehsan.com',
        password: pass
      });
      getAccountsStub = sinon
        .stub(TrueLayerAPI, 'getAccounts')
        .returns(Promise.resolve([{ account_id: '111' }]));

      getTransactionsStub = sinon
        .stub(TrueLayerAPI, 'getTransactions')
        .returns(
          Promise.resolve([{ transaction_id: '111' }, { transaction_id: '22' }])
        );
    });

    afterEach(() => {
      getAccountsStub.restore();
      getTransactionsStub.restore();
    });

    it('should give 401 error', async () => {
      let res = await request
        .post('/auth/login')
        .send({ username: 'ehsan@ehsan.com', password: 'myPassword' });

      res = await request
        .get('/transactions')
        .set({ Authorization: `Bearer ${res.body.token}` });

      expect(res.status).to.equal(401);
    });
  });

  describe('when the TrueLayer token is expired', () => {
    let getAccountsStub: sinon.SinonStub<[string], Promise<any>>;
    let getTransactionsStub: sinon.SinonStub<[string, string], Promise<any>>;
    let renewTokenStub;

    beforeEach(async () => {
      const expirationSec = 232222;
      const pass = await bcrypt.hash('myPassword', 10);
      await UsersRepository.addOne({
        id: 2020,
        username: 'ehsan@ehsan.com',
        password: pass
      });
      TokensCache.set('2020', {
        access_token: '1111111111',
        expires_in: expirationSec,
        token_type: 'sa',
        refresh_token: 'sa',
        expiresAtMs: new Date().getTime() - 1
      });
      getAccountsStub = sinon
        .stub(TrueLayerAPI, 'getAccounts')
        .returns(Promise.resolve([{ account_id: '111' }]));

      getTransactionsStub = sinon
        .stub(TrueLayerAPI, 'getTransactions')
        .returns(
          Promise.resolve([{ transaction_id: '111' }, { transaction_id: '22' }])
        );

      renewTokenStub = sinon.stub(TrueLayerAPI, 'renewToken').returns(
        Promise.resolve({
          access_token: '1111111111',
          expires_in: expirationSec,
          token_type: 'ABCD',
          refresh_token: 'sa',
          expiresAtMs: new Date().getTime() + expirationSec
        })
      );
    });

    afterEach(() => {
      getAccountsStub.restore();
      getTransactionsStub.restore();
    });

    it('should call for the token refreshment', async () => {
      let res = await request
        .post('/auth/login')
        .send({ username: 'ehsan@ehsan.com', password: 'myPassword' });

      res = await request
        .get('/transactions')
        .set({ Authorization: `Bearer ${res.body.token}` });

      // @ts-ignore
      expect(TokensCache.get('2020').token_type).to.eq('sa');
    });
  });
});
