const db = require('../config/db');

const OrderItem = {
  create: (orderId, productId, quantity, unitPrice, callback) => {
    const sql = `
      INSERT INTO Order_items (order_id, product_id, quantity, unit_price)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [orderId, productId, quantity, unitPrice], callback);
  },

  getByOrderId: (orderId, callback) => {
    const sql = 'SELECT * FROM Order_items WHERE order_id = ?';
    db.query(sql, [orderId], callback);
  }
};

module.exports = OrderItem;
