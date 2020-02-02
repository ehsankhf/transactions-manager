import mongoose from 'mongoose';

const { dbUrl, dbName } = require('../config').default[
  process.env.NODE_ENV
].mongo;

class Mongo {
  intialConnectionMaxTries = 10;
  intialConnectionCurrentTryIndex = 0;

  constructor() {
    mongoose.Promise = Promise;
  }

  async connect(): Promise<any> {
    try {
      await mongoose.connect(`${dbUrl}/${dbName}`, {
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: 10,
        reconnectInterval: 2000
      });
      console.info('MongoDB connected');
    } catch (err) {
      if (
        ++this.intialConnectionCurrentTryIndex < this.intialConnectionMaxTries
      ) {
        console.info(
          `MongoDB connection Initial retry (${this.intialConnectionCurrentTryIndex}/${this.intialConnectionMaxTries})`
        );

        return new Promise(resolve =>
          setTimeout(() => resolve(this.connect()), 2000)
        );
      } else {
        console.error('MongoDB connection error:', err.message);
        throw err;
      }
    }
  }

  async disconnect() {
    return mongoose.disconnect();
  }

  async removeAll() {
    return Promise.all(
      Object.keys(mongoose.connection.collections).map(collection => {
        mongoose.connection.collections[collection].drop(err => {
          console.info('collection dropped');
        });
      })
    );
  }
}

export default new Mongo();
