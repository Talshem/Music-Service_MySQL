  
'use strict';

var DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('preferences', {
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    item_id: DataTypes.STRING,
    type: DataTypes.STRING,
    username: DataTypes.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('preferences');
  }
};