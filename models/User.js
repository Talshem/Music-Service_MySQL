'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Song, {
        foreignKey: 'username'
      });
      this.hasMany(models.Album, {
        foreignKey: 'username'
      });
      this.hasMany(models.Artist, {
        foreignKey: 'username'
      });
      this.hasMany(models.Playlist, {
        foreignKey: 'username'
      });
    }
  };
  User.init({
    username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    password: DataTypes.STRING,
    is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
    },
    remember_token: DataTypes.TEXT,
    preferences: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    last_login: DataTypes.DATE,
  }, {
  scopes: {
  filter: {
    attributes: { exclude: ['password', 'remember_token'] },
  }},
    timestamps: false,
    sequelize,
    paranoid: true,
    underscored: true,
    modelName: 'User',
  });
  return User;
};