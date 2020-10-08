  
'use strict';

var DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('song_in_playlists', {
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
    },
    playlist_id: DataTypes.INTEGER,
    song_id: DataTypes.STRING,
    artist: DataTypes.STRING
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('song_in_playlists');
  }
};