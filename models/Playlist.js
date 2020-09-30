'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'UserEmail'
      });
    }
  };
  const date = new Date();

  Playlist.init({
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    name: DataTypes.STRING,
    songs: DataTypes.TEXT,
    is_liked: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    cover_img: DataTypes.STRING,
    created_at: {
    type: DataTypes.DATE,
    defaultValue: date.toISOString().substring(0, 10)
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: true,
    underscored: true,
    modelName: 'Playlist',
  });
  return Playlist;
};