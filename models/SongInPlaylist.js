'use strict';

const { Model } = require('sequelize');
const dataTypes = require('sequelize/lib/dialects/postgres/data-types');

module.exports = (sequelize, DataTypes) => {
  class SongInPlaylist extends Model {
    static associate(models) {
      this.belongsTo(models.Song, {
        foreignKey: 'SongId'
      });
      this.belongsTo(models.User, {
        foreignKey: 'PlaylistId'
      });
    }
  };

  SongInPlaylist.init({
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true    
    },
    artist: DataTypes.STRING,
  }, {
  scopes: {
  filter: {
    attributes: { exclude: ['SongId'] },
  }},
    sequelize,
    timestamps: false,
    underscored: true,
    paranoid: true,
    modelName: 'SongInPlaylist',
  });
  return SongInPlaylist;
};