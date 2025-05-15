// const db = require('../config/db');

// const User = {
//   create: (username, email, hashedPassword, fullName, birth_date, phone, address, role, callback) => {
//     const sql = `
//       INSERT INTO Users (username, email, password, full_name, birth_date, phone, address, role)
//       VALUES (?, ?, ?, ?, ?, ?, ?, 'user')
//     `;
//     db.query(sql, [username, email, hashedPassword, fullName, birth_date, phone, address, role], callback);
//   },

//   findAll: (callback) => {
//     const sql = 'SELECT * FROM Users';
//     db.query(sql, callback);
//   },

//   findByUsername: (username, callback) => {
//     const sql = 'SELECT * FROM Users WHERE username = ?';
//     db.query(sql, [username], callback);
//   },

//   findByEmail: (email, callback) => {
//     const sql = 'SELECT * FROM Users WHERE email = ?';
//     db.query(sql, [email], callback);
//   },

//   findById: (id, callback) => {
//     const sql = 'SELECT * FROM Users WHERE id = ?';
//     db.query(sql, [id], callback);
//   },
  
//   updateUserInfor : (id, data, callback) => {
//     const { username, email, full_name, phone, address, birth_date } = data;
//     const sql = `
//       UPDATE users
//       SET username = ?, email = ?, full_name = ?, phone = ?, address = ?, birth_date = ?, updated_at = NOW()
//       WHERE id = ?
//     `;
//     db.query(sql, [username, email, full_name, phone, address, birth_date, id], callback);
//   },

//   updatePassword: (id, newPassword, callback) => {
//     const sql = `
//       UPDATE users
//       SET password = ?, updated_at = NOW()
//       WHERE id = ?
//     `;
//     db.query(sql, [newPassword, id], callback);
//   },

//   setResetCode: (id, code, expires, callback) => {
//     const sql = `
//       UPDATE users
//       SET reset_code = ?, reset_expires = ?, updated_at = NOW()
//       WHERE id = ?
//     `;
//     db.query(sql, [code, expires, id], callback);
//   },

//   findUserByResetCode: (code, callback) => {
//     const sql = `
//       SELECT * FROM users
//       WHERE reset_code = ? AND reset_expires > NOW()
//     `;
//     db.query(sql, [code], callback);
//   },
  
//   clearResetCode: (id, callback) => {
//     const sql = `
//       UPDATE users
//       SET reset_code = NULL, reset_expires = NULL
//       WHERE id = ?
//     `;
//     db.query(sql, [id], callback);
//   },
// };


// module.exports = User;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  reset_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  },
  reset_expires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;



