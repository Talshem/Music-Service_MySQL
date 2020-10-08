'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    static associate(models) {
      this.belongsTo(models.Artist, {
        foreignKey: 'ArtistId'
      });
      this.belongsTo(models.Album, {
        foreignKey: 'AlbumId'
      });
      this.belongsTo(models.User, {
        foreignKey: 'username', as:'userUsername'
      });
      this.hasMany(models.SongInPlaylist, {
        foreignKey: 'SongId'
      });
    }
  };
  const date = new Date();

  Song.init({
    youtube_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true    
    },
    title: DataTypes.STRING,
    lyrics: DataTypes.TEXT,
    length: DataTypes.STRING,
    upload_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    track_number: DataTypes.INTEGER,
    is_liked: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    play_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
  }, {
  scopes: {
  filter: {
    attributes: { exclude: ['ArtistId', 'AlbumId'] },
  }},
    sequelize,
    timestamps: false,
    underscored: true,
    paranoid: true,
    modelName: 'Song',
  });
  return Song;
};