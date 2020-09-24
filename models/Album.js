'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      this.hasMany(models.Song);
      this.belongsTo(models.User, {
        foreignKey: 'user'
      });
    }
  };
  Album.init({
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    name: DataTypes.STRING,
    artist: DataTypes.INTEGER,
    is_liked: DataTypes.INTEGER,
    cover_img: DataTypes.STRING,
    user: DataTypes.STRING,
    upload_at: DataTypes.DATE,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Album',
  });
  return Album;
};