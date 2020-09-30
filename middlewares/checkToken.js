require('dotenv').config();
const jwt = require('jsonwebtoken');

let checkToken =  (req, res, next) => {
    let authHeader = req.headers['x-access-token'] || req.headers['authorization'];
    if (authHeader.split(' ')[0] === 'bearer') {
    let token = authHeader && authHeader.slice(7, authHeader.length)
      jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
        if (error) {
          return res.status(403).json({ success: false, message: error });
        } else {
          req.decoded = decoded
          next();
        }
      })
    } else {
      return res.status(403).json({ message: 'token is requierd' });
    }
  }

  module.exports = checkToken