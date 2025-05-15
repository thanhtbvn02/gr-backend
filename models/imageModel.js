// const db = require('../config/db');

// const Image = {
//   getByProductId: (productId, callback) => {
//     const sql = 'SELECT * FROM Images WHERE product_id = ? ORDER BY id ASC';
//     db.query(sql, [productId], callback);
//   },

//   create: (productId, url, callback) => {
//     const sql = 'INSERT INTO Images (product_id, url) VALUES (?, ?)';
//     db.query(sql, [productId, url], callback);
//   },

//   remove: (id, callback) => {
//     const sql = 'DELETE FROM Images WHERE id = ?';
//     db.query(sql, [id], callback);
//   }
// };

// module.exports = Image;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
} );

module.exports = Image; 

