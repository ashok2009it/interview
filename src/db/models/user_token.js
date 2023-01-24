'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_Token.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_id",
      });
    }
  }
  User_Token.init({
    user_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    type: DataTypes.STRING,
    used: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User_Token',
  });
  return User_Token;
};