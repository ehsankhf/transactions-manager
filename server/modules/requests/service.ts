import { RequestsModel } from './model';

export class RequestsService {
  static async addOne(url: string, response: object, status: number) {
    return RequestsModel.create({ url, response, status });
  }

  static async getAll() {
    return RequestsModel.find({});
  }
}
