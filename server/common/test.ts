import db from './mysql';

export default class Common {
  static async createMySqlDB() {
    return Promise.all(
      Object.keys(db.models).map(modelName => db.models[modelName].sync())
    );
  }

  static async cleanMySqlDB() {
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('DELETE FROM `transactions` WHERE TRUE');
    await db.query('DELETE FROM `users` WHERE TRUE');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
  }
}
