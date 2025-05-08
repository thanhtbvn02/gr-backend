const session = require('express-session');
const envConfig = require('../config/envconfig');

const sessionMiddleware = session({
  secret: envConfig.sessionSecret, 
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,      
    httpOnly: true,
    maxAge: 5 * 60 * 1000 
  }
});

module.exports = sessionMiddleware;