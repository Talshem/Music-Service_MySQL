'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    static associate(models) {
      this.hasMany(models.Song);
      this.hasMany(models.Album);
      this.belongsTo(models.User, {
        foreignKey: 'user'
      });
    }
  };
  Artist.init({
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    name: DataTypes.STRING,
    is_liked: DataTypes.INTEGER,
    cover_img: DataTypes.STRING,
    user: DataTypes.STRING,
    upload_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Artist',
  });
  return Artist;
};