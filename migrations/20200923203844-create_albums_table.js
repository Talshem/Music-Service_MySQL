  
'use strict';

var DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date();
    await queryInterface.createTable('albums', {
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    name: DataTypes.STRING,
    artist_id: DataTypes.INTEGER,
    is_liked: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    cover_img: DataTypes.STRING,
    username: DataTypes.STRING,
    upload_at: DataTypes.DATE,
    created_at: DataTypes.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('albums');
  }
};