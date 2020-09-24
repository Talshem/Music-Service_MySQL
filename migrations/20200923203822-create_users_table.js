  
'use strict';

var DataTypes = require('sequelize/lib/data-types');

module.exports = {
  up: async (queryInterface, Sequelize) => {
const date = new Date();
    await queryInterface.createTable('users', {
    email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    is_admin: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    },
    remember_token: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    },
    preferences: DataTypes.JSON,
    created_at: {
    type: DataTypes.DATE,
    defaultValue: date.toISOString().substring(0, 10)
    },
    last_login: {
    type: DataTypes.DATE,
    defaultValue: date.toISOString().substring(0, 10),
    },
    auto_code: DataTypes.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};