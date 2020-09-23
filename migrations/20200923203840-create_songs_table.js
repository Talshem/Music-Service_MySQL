  
'use strict';

var DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('songs', {
    youtube_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true    
    },
    title: DataTypes.STRING,
    lyrics: DataTypes.BLOB,
    artist: DataTypes.INTEGER,
    album: DataTypes.INTEGER,
    length: DataTypes.STRING,
    upload_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    track_number: DataTypes.INTEGER,
    user: DataTypes.STRING,
    is_liked: DataTypes.INTEGER,
    play_count: DataTypes.INTEGER
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('songs');
  }
};