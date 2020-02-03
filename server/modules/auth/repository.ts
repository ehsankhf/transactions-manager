import Users from './model';
import { User } from '../../types/User';

export default class UsersRepository {
  static async addOne(transactions: User): Promise<any> {
    return Users.create(transactions);
  }

  static async getOneByUsername(username: string): Promise<any> {
    return Users.findOne({ where: { username } });
  }
}
