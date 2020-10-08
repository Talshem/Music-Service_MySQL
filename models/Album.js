'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      this.hasMany(models.Song);
      this.belongsTo(models.User, {
        foreignKey: 'username', as:'userUsername'
      });
      this.belongsTo(models.Artist, {
        foreignKey: 'ArtistId'
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
    is_liked: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    cover_img: DataTypes.STRING,
    upload_at: DataTypes.DATE,
    created_at: DataTypes.DATE
  }, {
  scopes: {
  filter: {
    attributes: { exclude: ['ArtistId'] },
  }},
    sequelize,
    timestamps: false,
    paranoid: true,
    underscored: true,
    modelName: 'Album',
  });
  return Album;
};