const db = require('../config/db');

const User = {
  create: (username, email, hashedPassword, fullName, birth_date, phone, address, role, callback) => {
    const sql = `
      INSERT INTO Users (username, email, password, full_name, birth_date, phone, address, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'user')
    `;
    db.query(sql, [username, email, hashedPassword, fullName, birth_date, phone, address, role], callback);
  },

  findByUsername: (username, callback) => {
    const sql = 'SELECT * FROM Users WHERE username = ?';
    db.query(sql, [username], callback);
  },

  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM Users WHERE email = ?';
    db.query(sql, [email], callback);
  },

  findById: (id, callback) => {
    const sql = 'SELECT * FROM Users WHERE id = ?';
    db.query(sql, [id], callback);
  },
  
  updateUserInfor : (id, data, callback) => {
    const { username, email, full_name, phone, address, birth_date } = data;
    const sql = `
      UPDATE users
      SET username = ?, email = ?, full_name = ?, phone = ?, address = ?, birth_date = ?, updated_at = NOW()
      WHERE id = ?
    `;
    db.query(sql, [username, email, full_name, phone, address, birth_date, id], callback);
  },

  updatePassword: (id, newPassword, callback) => {
    const sql = `
      UPDATE users
      SET password = ?, updated_at = NOW()
      WHERE id = ?
    `;
    db.query(sql, [newPassword, id], callback);
  },

  setResetCode: (id, code, expires, callback) => {
    const sql = `
      UPDATE users
      SET reset_code = ?, reset_expires = ?, updated_at = NOW()
      WHERE id = ?
    `;
    db.query(sql, [code, expires, id], callback);
  },

  findUserByResetCode: (code, callback) => {
    const sql = `
      SELECT * FROM users
      WHERE reset_code = ? AND reset_expires > NOW()
    `;
    db.query(sql, [code], callback);
  },
  
  clearResetCode: (id, callback) => {
    const sql = `
      UPDATE users
      SET reset_code = NULL, reset_expires = NULL
      WHERE id = ?
    `;
    db.query(sql, [id], callback);
  },
};


module.exports = User;
