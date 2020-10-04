'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'username', as:'userUsername'
      });
      this.hasMany(models.SongInPlaylist, {
        foreignKey: 'PlaylistId'
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
    is_liked: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    cover_img: DataTypes.STRING,
    created_at: DataTypes.DATE,
  }, {
    sequelize,
    timestamps: false,
    paranoid: true,
    underscored: true,
    modelName: 'Playlist',
  });
  return Playlist;
};