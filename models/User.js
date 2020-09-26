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
    is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
    },
    remember_token: {
    type: DataTypes.BOOLEAN,
    defaultValue: 1,
    },
    preferences: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    last_login: DataTypes.DATE,
    auto_code: DataTypes.STRING
  }, {
  scopes: {
  filter: {
    attributes: { exclude: ['password', 'auto_code'] },
  }},
    timestamps: false,
    sequelize,
    paranoid: true,
    underscored: true,
    modelName: 'User',
  });
  return User;
};