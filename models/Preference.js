'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Preference extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'username', as:'userUsername'
      });
    }
  };

  Preference.init({
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    item_id: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    paranoid: true,
    underscored: true,
    modelName: 'Preference',
  });
  return Preference;
};