const db = require('../config/db');

const Image = {
  getByProductId: (productId, callback) => {
    const sql = 'SELECT * FROM Images WHERE product_id = ? ORDER BY id ASC';
    db.query(sql, [productId], callback);
  },

  create: (productId, url, callback) => {
    const sql = 'INSERT INTO Images (product_id, url) VALUES (?, ?)';
    db.query(sql, [productId, url], callback);
  },

  remove: (id, callback) => {
    const sql = 'DELETE FROM Images WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Image;
