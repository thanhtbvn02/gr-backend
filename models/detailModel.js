// const db = require('../config/db');

// const Detail = {
//   getByProductId: (productId, callback) => {
//     const sql = 'SELECT * FROM Details WHERE product_id = ?';
//     db.query(sql, [productId], callback);
//   },

//   create: (productId, keyName, value, callback) => {
//     const sql = 'INSERT INTO Details (product_id, key_name, value) VALUES (?, ?, ?)';
//     db.query(sql, [productId, keyName, value], callback);
//   },

//   remove: (id, callback) => {
//     const sql = 'DELETE FROM Details WHERE id = ?';
//     db.query(sql, [id], callback);
//   }
// };

// module.exports = Detail;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Detail = sequelize.define('Detail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  key_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Detail;  


