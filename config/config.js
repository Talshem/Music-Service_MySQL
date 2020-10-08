const fs = require('fs');
require('dotenv').config();

module.exports = {
  development: {
    username: 'talsh',
    password: null,
    database: 'music',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'talsh',
    password: null,
    database: 'music',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_user,
    password:  process.env.DB_password,
    database:  process.env.DB_database,
    host:  process.env.DB_host,
    dialect: 'mysql'
  }
}