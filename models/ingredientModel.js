// const db = require('../config/db');

// const Ingredient = {
//   getByProductId: (productId, callback) => {
//     const sql = 'SELECT * FROM Ingredients WHERE product_id = ?';
//     db.query(sql, [productId], callback);
//   },

//   create: (productId, name, quantity, callback) => {
//     const sql = 'INSERT INTO Ingredients (product_id, name, quantity) VALUES (?, ?, ?)';
//     db.query(sql, [productId, name, quantity], callback);
//   },

//   remove: (id, callback) => {
//     const sql = 'DELETE FROM Ingredients WHERE id = ?';
//     db.query(sql, [id], callback);
//   }
// };

// module.exports = Ingredient;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ingredient = sequelize.define('Ingredient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,  
    primaryKey: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ingredients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Ingredient;



