const db = require('../config/db');

const Admin = {
  create: (name, username, hashedPassword, callback) => {
    const sql = 'INSERT INTO Admin (name, username, password) VALUES (?, ?, ?)';
    db.query(sql, [name, username, hashedPassword], callback);
  },

  findByUsername: (username, callback) => {
    const sql = 'SELECT * FROM Admin WHERE username = ?';
    db.query(sql, [username], callback);
  }
};

module.exports = Admin;
