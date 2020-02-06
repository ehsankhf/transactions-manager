/* eslint-disable @typescript-eslint/camelcase */

import supertest from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import 'mocha';

import server from '../../server';
import TrueLayerAPI from '../../common/TrueLayerAPI';
import { TokensCache } from '../../common/TokensCache';
import UsersRepository from './repository';
import commonTest from '../../common/test';

const request = supertest(server);

describe('Auth', () => {
  beforeEach(async () => {
    await commonTest.createMySqlDB();
    return commonTest.cleanMySqlDB();
  });

  afterEach(async () => {
    server.close();
  });

  it('should receive the expected response', async () => {
    const exchangeCodeStub = sinon.stub(TrueLayerAPI, 'exchangeCode').returns(
      Promise.resolve({
        access_token: 'JWT-ACCESS-TOKEN-HERE',
        expires_in: 123,
        token_type: 'Bearer',
        expiresAtMs: 122,
        refresh_token: 'REFRESH-TOKEN-HERE'
      })
    );

    await request.get('/auth/callback?state=1');
    const {
      access_token,
      expires_in,
      token_type,
      refresh_token
    }: any = TokensCache.get('1');
    expect({
      access_token,
      expires_in,
      token_type,
      refresh_token
    }).to.deep.equal({
      access_token: 'JWT-ACCESS-TOKEN-HERE',
      expires_in: 123,
      token_type: 'Bearer',
      refresh_token: 'REFRESH-TOKEN-HERE'
    });
    exchangeCodeStub.restore();
  });

  describe('login', () => {
    it('should receive a token if the user can login', async () => {
      const pass = await bcrypt.hash('myPassword', 10);
      await UsersRepository.addOne({
        username: 'ehsan@ehsan.com',
        password: pass
      });
      const res = await request
        .post('/auth/login')
        .send({ username: 'ehsan@ehsan.com', password: 'myPassword' });
      expect(res.body).to.have.property('token');
    });

    it('should fail if the user is not registered', async () => {
      const res = await request
        .post('/auth/login')
        .send({ username: 'ehsan1@ehsan.com', password: 'myPassword' });
      expect(res.body).to.deep.equal({ message: 'Authentication failed' });
    });

    it('should fail if the entered values are invalid', async () => {
      const pass = await bcrypt.hash('myPassword', 10);
      await UsersRepository.addOne({
        username: 'ehsan@ehsan.com',
        password: pass
      });
      const res = await request
        .post('/auth/login')
        .send({ username: 'ehsan1@ehsan.com', password: '1' });
      expect(res.body).to.deep.equal({ message: 'Authentication failed' });
    });
  });

  describe('register', () => {
    it('should register the user successfully the the right email and password', async () => {
      const res = await request
        .post('/auth/register')
        .send({ username: 'ehsan@ehsan.com', password: 'myPassword' });

      expect(res.body).to.deep.equal({
        message: 'Successfully registered!'
      });
    });

    it('should fail if the user is duplicated', async () => {
      const pass = await bcrypt.hash('myPassword', 10);
      await UsersRepository.addOne({
        username: 'ehsan@ehsan.com',
        password: pass
      });
      const res = await request
        .post('/auth/register')
        .send({ username: 'ehsan@ehsan.com', password: 'myPassword' });

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({ message: 'Registration failed' });
    });

    it('should fail if the entered values are invalid', async () => {
      const res = await request
        .post('/auth/register')
        .send({ username: 'ehsan@ehsan.com', password: '1' });

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({ message: 'Registration failed' });
    });
  });
});
