/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';

export default class TrueLayerAPI {
  static async exchangeCode(code: string) {
    const resp = await axios({
      method: 'post',
      url: 'https://auth.truelayer.com/connect/token',
      data: {
        grant_type: 'authorization_code',
        client_id: process.env.TRUE_LAYER_CLIENT_ID,
        client_secret: process.env.TRUE_LAYER_CLIENT_SECRET,
        redirect_uri: 'http://localhost:5000/auth/transaction',
        code
      }
    });
    return resp.data;
  }

  static async renewToken(refreshToken: string) {
    const resp = await axios({
      method: 'post',
      url: 'https://auth.truelayer.com/connect/token',
      data: {
        grant_type: 'refresh_token',
        client_id: process.env.TRUE_LAYER_CLIENT_ID,
        client_secret: process.env.TRUE_LAYER_CLIENT_SECRET,
        refresh_token: refreshToken
      }
    });
    return resp.data;
  }

  static async getAccounts(accessToken: string) {
    const resp = await axios({
      method: 'get',
      url: 'https://api.truelayer.com/data/v1/accounts',
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return resp.data;
  }

  static async getTransactions(accessToken: string, accountId: string) {
    const resp = await axios({
      method: 'get',
      url: `https://api.truelayer.com/data/v1/accounts/${accountId}/transactions`,
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return resp.data;
  }
}
