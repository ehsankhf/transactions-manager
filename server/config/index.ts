export default {
  development: {
    mongo: {
      username: 'root',
      password: null,
      dbName: 'database_development',
      dbUrl: 'mongodb://127.0.0.1'
    },
    mysql: {
      name: 'database_development',
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'pass'
    }
  },
  test: {
    mongo: {
      username: 'root',
      password: null,
      dbName: 'database_test',
      dbUrl: 'mongodb://127.0.0.1'
    },
    mysql: {
      name: 'database_test',
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'pass'
    }
  }
};
