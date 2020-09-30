require('dotenv').config();
const jwt = require('jsonwebtoken');

let checkToken =  (req, res, next) => {
    let authHeader = req.headers['x-access-token'] || req.headers['authorization'];
    if (authHeader.split(' ')[0] === 'bearer') {
    token = authHeader && authHeader.slice(7, token.length)
      jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
        if (error) {
          return res.status(403).json({ success: false, message: error });
        } else {
          const newToken = {
            is_admin: decoded.is_admin,
            username: decoded.username,
            userEmail: decoded.userEmail,
          }
          const token = jwt.sign(newToken, process.env.SECRET_KEY, { expiresIn: '7d' });
          req.decoded = decoded
          res.cookie('token', token);
          next();
        }
      })
    } else {
      return res.status(403).json({ message: 'token is requierd' });
    }
  }

  module.exports = checkToken