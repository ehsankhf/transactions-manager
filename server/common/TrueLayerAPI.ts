/* eslint-disable @typescript-eslint/camelcase */
import * as request from 'request-promise';
import { Token } from '../types/Token';
import { Transaction } from '../types/Transaction';

export default class TrueLayerAPI {
  static async exchangeCode(code: string): Promise<Token> {
    const requestOptions: request.Options = {
      uri: `https://auth.truelayer-sandbox.com/connect/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        grant_type: 'authorization_code',
        client_id: process.env.TRUE_LAYER_CLIENT_ID,
        client_secret: process.env.TRUE_LAYER_CLIENT_SECRET,
        redirect_uri: 'http://localhost:5000/auth/callback',
        code
      }
    };

    // eslint-disable-next-line no-useless-catch
    try {
      const response: string = await request.post(requestOptions);
      return JSON.parse(response);
    } catch (error) {
      throw error;
    }
  }

  static async renewToken(refreshToken: string): Promise<Token> {
    const requestOptions: request.Options = {
      uri: 'https://auth.truelayer-sandbox.com/connect/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        grant_type: 'refresh_token',
        client_id: process.env.TRUE_LAYER_CLIENT_ID,
        client_secret: process.env.TRUE_LAYER_CLIENT_SECRET,
        refresh_token: refreshToken
      }
    };

    // eslint-disable-next-line no-useless-catch
    try {
      const response: string = await request.post(requestOptions);
      return JSON.parse(response);
    } catch (error) {
      throw error;
    }
  }

  static async getAccounts(accessToken: string): Promise<Array<Account>> {
    const requestOptions: request.Options = {
      uri: 'https://api.truelayer-sandbox.com/data/v1/accounts',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`
      }
    };

    // eslint-disable-next-line no-useless-catch
    try {
      const response: string = await request.get(requestOptions);
      return JSON.parse(response).results;
    } catch (error) {
      throw error;
    }
  }

  static async getTransactions(
    accessToken: string,
    accountId: string
  ): Promise<Array<Transaction>> {
    const requestOptions: request.Options = {
      uri: `https://api.truelayer-sandbox.com/data/v1/accounts/${accountId}/transactions`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`
      }
    };

    // eslint-disable-next-line no-useless-catch
    try {
      const response: string = await request.get(requestOptions);
      return JSON.parse(response).results;
    } catch (error) {
      throw error;
    }
  }
}
