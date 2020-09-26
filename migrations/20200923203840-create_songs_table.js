  
'use strict';

var DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date();
    await queryInterface.createTable('songs', {
    youtube_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true    
    },
    title: DataTypes.STRING,
    artist_id: DataTypes.INTEGER,
    album_id: DataTypes.INTEGER,
    lyrics: DataTypes.TEXT,
    length: DataTypes.STRING,
    upload_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    track_number: DataTypes.INTEGER,
    user_email:  DataTypes.STRING,
    is_liked: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    play_count:  {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('songs');
  }
};