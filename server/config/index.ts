export default {
  development: {
    mongo: {
      username: 'root',
      password: null,
      dbName: 'database_development',
      dbUrl: 'mongodb://127.0.0.1'
    }
  },
  test: {
    mongo: {
      username: 'root',
      password: null,
      dbName: 'database_test',
      dbUrl: 'mongodb://127.0.0.1'
    }
  }
};
