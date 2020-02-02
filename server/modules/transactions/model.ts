/* eslint-disable @typescript-eslint/camelcase */

import Sequelize from 'sequelize';
import db from '../../common/mysql';

const Transactions = db.define(
  'transactions',
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    transaction_id: {
      type: Sequelize.BIGINT
    },
    timestamp: {
      type: Sequelize.DATE
    },
    amount: {
      type: Sequelize.DECIMAL
    },
    currency: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    transaction_type: {
      type: Sequelize.STRING
    },
    transaction_category: {
      type: Sequelize.STRING
    },
    running_balance: {
      type: Sequelize.JSON
    },
    meta: {
      type: Sequelize.JSON
    }
  },
  {
    timestamps: true
  }
);

module.exports = {
  Transactions
};
