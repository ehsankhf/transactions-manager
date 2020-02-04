import { Model, DataTypes } from 'sequelize';
import db from '../../common/mysql';
import Transactions from '../transactions/model';

class Users extends Model {}

Users.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: db,
    tableName: 'users',
    indexes: [
      {
        unique: true,
        fields: ['username']
      }
    ]
  }
);

Users.hasMany(Transactions, { sourceKey: 'id', foreignKey: 'user_id' });

export default Users;
