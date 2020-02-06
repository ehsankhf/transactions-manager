import { RequestsModel } from './model';

export class RequestsRepository {
  static async addOne(url: string, response: object, status: number) {
    return RequestsModel.create({ url, response, status });
  }

  static async getAll() {
    return RequestsModel.find({});
  }
}
