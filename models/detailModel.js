const db = require('../config/db');

const Detail = {
  getByProductId: (productId, callback) => {
    const sql = 'SELECT * FROM Details WHERE product_id = ?';
    db.query(sql, [productId], callback);
  },

  create: (productId, keyName, value, callback) => {
    const sql = 'INSERT INTO Details (product_id, key_name, value) VALUES (?, ?, ?)';
    db.query(sql, [productId, keyName, value], callback);
  },

  remove: (id, callback) => {
    const sql = 'DELETE FROM Details WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Detail;
