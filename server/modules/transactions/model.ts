/* eslint-disable @typescript-eslint/camelcase */

import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import db from '../../common/mysql';

class Transactions extends Model {}

Transactions.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT
    },
    transaction_id: {
      type: DataTypes.STRING
    },
    timestamp: {
      type: DataTypes.DATE
    },
    amount: {
      type: DataTypes.DECIMAL
    },
    currency: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    transaction_type: {
      type: DataTypes.STRING
    },
    transaction_category: {
      type: DataTypes.STRING
    },
    running_balance: {
      type: DataTypes.JSON
    },
    meta: {
      type: DataTypes.JSON
    }
  },
  {
    sequelize: db,
    tableName: 'transactions'
  }
);

export default Transactions;
