'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    static associate(models) {
      this.hasMany(models.Song);
      this.belongsTo(models.User, {
        foreignKey: 'user'
      });
    }
  };
  Playlist.init({
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    name: DataTypes.STRING,
    songs: DataTypes.JSON,
    is_liked: DataTypes.INTEGER,
    cover_img: DataTypes.STRING,
    user: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Playlist',
  });
  return Playlist;
};