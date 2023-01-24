'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Teams.belongsToMany(models.User, {
        through: "Team_User",
        as: "users",
        foreignKey: "user_id",
      });
    }
  }
  Teams.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Teams',
  });
  return Teams;
};