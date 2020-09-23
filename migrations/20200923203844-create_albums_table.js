  
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('albums', {
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
    name: DataTypes.STRING,
    artist: DataTypes.INTEGER,
    is_liked: DataTypes.INTEGER,
    cover_img: DataTypes.STRING,
    user: DataTypes.STRING,
    upload_at: DataTypes.DATE,
    created_at: DataTypes.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('albums');
  }
};