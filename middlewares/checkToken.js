require('dotenv').config();
const jwt = require('jsonwebtoken');

let checkToken =  (req, res, next) => {
  try{
    let authHeader = req.headers['x-access-token'] || req.headers['authorization'];
    if (authHeader.split(' ')[0] === 'bearer') {
    let token = authHeader && authHeader.slice(7, authHeader.length)
      jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
        if (error) {
          return res.status(403).json({ success: false, message: error });
        } else {
          req.decoded = decoded
          req.token = token
          req.username = req.headers['username']
          req.admin = req.headers['isuseradmin']
          next();
        }
      })
    } else {
      return res.status(403).json({ message: 'token is requierd' });
    }
  } catch {
return res.send('You are not authorized to do this action.');
  }
}

  module.exports = checkToken