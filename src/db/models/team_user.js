'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Team_User.init({
    team_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    is_team_lead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Team_User',
  });
  return Team_User;
};