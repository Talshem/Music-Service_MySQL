'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    static associate(models) {
      this.belongsTo(models.Artist, {
        foreignKey: 'artist'
      });
      this.belongsTo(models.Album, {
        foreignKey: 'album'
      });
      this.belongsTo(models.User, {
      foreignKey: 'user'
      });
    }
  };
  Song.init({
    youtube_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true    
    },
    title: DataTypes.STRING,
    artist: DataTypes.INTEGER,
    album: DataTypes.INTEGER,
    length: DataTypes.STRING,
    upload_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    track_number: DataTypes.INTEGER,
    user: DataTypes.STRING,
    is_liked: DataTypes.INTEGER,
    play_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};