'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    static associate(models) {
      this.hasMany(models.Song);
      this.hasMany(models.Album);
      this.belongsTo(models.User, {
        foreignKey: 'UserEmail'
      });
    }
  };

  const date = new Date();

  Artist.init({
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
  }, {
    sequelize,
    timestamps: false,
    paranoid: true,
    underscored: true,
    modelName: 'Artist',
  });
  return Artist;
};