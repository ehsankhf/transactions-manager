import Users from './model';
import { User } from '../../types/User';

export default class UsersRepository {
  static async addOne(user: User): Promise<any> {
    return Users.create(user);
  }

  static async getOneByUsername(username: string): Promise<any> {
    return Users.findOne({ where: { username } });
  }
}
