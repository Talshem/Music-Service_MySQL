  
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
    ArtistId: {
    field: 'artist', 
    type: DataTypes.INTEGER
    },
    is_liked: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    cover_img: DataTypes.STRING,
    UserEmail: {
    field: 'user', 
    type: DataTypes.STRING
    },
    upload_at: {
    type: DataTypes.DATE,
    defaultValue: date.toISOString().substring(0, 10)
    },
    created_at: DataTypes.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('albums');
  }
};