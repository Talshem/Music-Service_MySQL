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
      foreignKey: 'UserEmail'
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
    ArtistId: {
    field: 'artist', 
    type: DataTypes.INTEGER 
    } ,
    artist_name: DataTypes.STRING, 
    AlbumId: {
    field: 'album', 
    type: DataTypes.INTEGER 
    },
    album_name: DataTypes.STRING,
    lyrics: DataTypes.TEXT,
    length: DataTypes.STRING,
    upload_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    track_number: DataTypes.INTEGER,
    UserEmail: {
    field: 'user', 
    type: DataTypes.STRING
    },
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
    attributes: { exclude: ['ArtistId', 'AlbumId', 'UserEmail'] },
  }},
    sequelize,
    timestamps: false,
    modelName: 'Song',
  });
  return Song;
};