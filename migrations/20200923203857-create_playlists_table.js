  
'use strict';

var DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('playlists', {
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    name: DataTypes.STRING,
    songs: DataTypes.TEXT,
    is_liked: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    cover_img: DataTypes.STRING,
    user_email: DataTypes.INTEGER,
    created_at:DataTypes.DATE,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('playlists');
  }
};