'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      this.hasMany(models.Song);
      this.belongsTo(models.User, {
        foreignKey: 'UserEmail'
      });
    }
  };

  const date = new Date();

  Album.init({
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    name: DataTypes.STRING,
    ArtistId: {
    field: 'artist', 
    type: DataTypes.INTEGER
    },
    artist_name: DataTypes.STRING, 
    is_liked: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    cover_img: DataTypes.STRING,
    UserEmail: {
    field: 'user', 
    type: DataTypes.STRING
    },
    upload_at: DataTypes.DATE,
    created_at: DataTypes.DATE
  }, {
  scopes: {
  filter: {
    attributes: { exclude: ['UserEmail, ArtistId'] },
  }},
    sequelize,
    timestamps: false,
    modelName: 'Album',
  });
  return Album;
};