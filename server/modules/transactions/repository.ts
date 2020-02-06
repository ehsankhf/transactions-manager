/* eslint-disable @typescript-eslint/camelcase */

import Transactions from './model';
import { Transaction } from '../../types/Transaction';

export default class TransactionsRepository {
  static async addAll(transactions: Array<Transaction>): Promise<any> {
    return Transactions.bulkCreate(transactions);
  }

  static async getAll(userId: string): Promise<any> {
    return Transactions.findAll({ where: { user_id: userId }, raw: true });
  }
}
