const db = require('../config/db');

const Ingredient = {
  getByProductId: (productId, callback) => {
    const sql = 'SELECT * FROM Ingredients WHERE product_id = ?';
    db.query(sql, [productId], callback);
  },

  create: (productId, name, quantity, callback) => {
    const sql = 'INSERT INTO Ingredients (product_id, name, quantity) VALUES (?, ?, ?)';
    db.query(sql, [productId, name, quantity], callback);
  },

  remove: (id, callback) => {
    const sql = 'DELETE FROM Ingredients WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Ingredient;
