  
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
    ArtistId: {
    field: 'artist', 
    type: DataTypes.INTEGER 
    } ,
    AlbumId: {
    field: 'album', 
    type: DataTypes.INTEGER 
    },
    lyrics: DataTypes.TEXT,
    length: DataTypes.STRING,
    upload_at: {
    type: DataTypes.DATE,
    defaultValue: date.toISOString().substring(0, 10)
    },
    created_at: DataTypes.DATE,
    track_number: DataTypes.INTEGER,
    UserEmail: {
    field: 'user', 
    type: DataTypes.STRING
    },
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