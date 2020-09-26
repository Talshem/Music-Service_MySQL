  
'use strict';

var DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date();
    await queryInterface.createTable('artists', {
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
    user_email: DataTypes.INTEGER,
    upload_at: DataTypes.DATE,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('artists');
  }
};