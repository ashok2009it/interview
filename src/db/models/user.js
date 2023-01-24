'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Roles, {
        through: 'User_Role',
        as: 'roles',
        foreignKey: 'user_id',
      });
      User.hasMany(models.User_Token, {
        as: 'tokens',
        foreignKey: 'user_id',
      });
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: DataTypes.BOOLEAN,
      is_email_verified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
      modelName: 'User',
    }
  );

  User.beforeSave(async (user, options) => {
    if (user.password) {
      user.password = bcrypt.hashSync(
        user.password,
        bcrypt.genSaltSync(10),
        null
      );
    }
  });
  User.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };

  return User;
};
