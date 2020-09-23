'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Song);
      this.hasMany(models.Album);
      this.hasMany(models.Artist);
      this.hasMany(models.Playlist);
    }
  };
  User.init({
    email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    is_admin: DataTypes.INTEGER,
    remember_token: DataTypes.INTEGER,
    preferences: DataTypes.JSON,
    created_at: DataTypes.DATE,
    last_login: DataTypes.DATE,
    auto_code: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};