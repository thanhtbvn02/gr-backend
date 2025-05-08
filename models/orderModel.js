const db = require('../config/db');

const Order = {
  create: (userId, totalAmount, status, paymentMethod, shippingAddress, message, callback) => {
    const sql = `
      INSERT INTO Orders (user_id, total_amount, status, payment_method, shipping_address, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [userId, totalAmount, status, paymentMethod, shippingAddress, message], callback);
  },

  getById: (id, callback) => {
    const sql = 'SELECT * FROM Orders WHERE id = ?';
    db.query(sql, [id], callback);
  },

  getByUserId: (userId, callback) => {
    const sql = 'SELECT * FROM Orders WHERE user_id = ?';
    db.query(sql, [userId], callback);
  },

  updateStatus: (orderId, status, callback) => {
    const sql = 'UPDATE Orders SET status = ? WHERE id = ?';
    db.query(sql, [status, orderId], callback);
  }
};

module.exports = Order;
