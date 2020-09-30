  
'use strict';

var DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: async (queryInterface, Sequelize) => {
const date = new Date();
    await queryInterface.createTable('users', {
    username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
    },
    password: DataTypes.STRING,
    is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
    },
    remember_token: DataTypes.TEXT,
    preferences: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    last_login: DataTypes.DATE,
    auto_code: DataTypes.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};