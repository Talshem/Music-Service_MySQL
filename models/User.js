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
  const date = new Date();
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
    created_at: {
    type: DataTypes.DATE,
    defaultValue: date.toISOString().substring(0, 10)
    },
    last_login: {
    type: DataTypes.DATE,
    defaultValue: date.toISOString().substring(0, 10),
    },
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