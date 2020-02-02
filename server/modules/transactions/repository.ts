import Transactions from './model';
import { Transaction } from '../../types/Transaction';

export default class TransactionsRepository {
  static async addAll(transactions: Array<Transaction>): Promise<any> {
    return Transactions.bulkCreate(transactions);
  }

  static async getAll() {
    return Transactions.findAll();
  }
}
