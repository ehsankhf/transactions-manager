import { Sequelize } from 'sequelize';

const conf = require('../config').default[process.env.NODE_ENV! || 'test'].mysql;

export default new Sequelize(conf.name, conf.username, conf.password, {
  dialect: conf.dialect,
  pool: conf.pool,
  port: conf.port,
  host: conf.host,
  sync: { force: true }
});
