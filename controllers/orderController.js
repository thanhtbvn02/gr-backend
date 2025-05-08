const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');

const orderController = {
  createOrder: (req, res) => {
    // Giả sử client gửi lên: { user_id, orderItems, shipping_address, message, payment_method }
    // orderItems: [ { product_id, quantity, unit_price }, ... ]
    const { user_id, orderItems, shipping_address, message, payment_method } = req.body;

    if (!user_id || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'Missing user_id or order items' });
    }

    // Tính tổng tiền (đơn giản)
    const total_amount = orderItems.reduce((sum, item) => {
      return sum + item.quantity * item.unit_price;
    }, 0);

    // Tạo order
    Order.create(user_id, total_amount, 'pending', payment_method || 'cash_on_delivery', shipping_address, message,
      (err, orderResult) => {
        if (err) return res.status(500).json({ error: err });
        const orderId = orderResult.insertId;

        // Tạo order items
        let itemsCreated = 0;
        orderItems.forEach((item) => {
          OrderItem.create(orderId, item.product_id, item.quantity, item.unit_price, (err2) => {
            if (err2) console.log('Error creating order item:', err2);
            itemsCreated++;
            if (itemsCreated === orderItems.length) {
              return res.status(201).json({ message: 'Order created', order_id: orderId });
            }
          });
        });
      }
    );
  },

  getOrderById: (req, res) => {
    const { id } = req.params;
    Order.getById(id, (err, orderResults) => {
      if (err) return res.status(500).json({ error: err });
      if (!orderResults.length) {
        return res.status(404).json({ message: 'Order not found' });
      }
      const order = orderResults[0];

      OrderItem.getByOrderId(id, (err2, itemResults) => {
        if (err2) return res.status(500).json({ error: err2 });
        order.items = itemResults;
        return res.json(order);
      });
    });
  },

  getOrdersByUser: (req, res) => {
    const { userId } = req.params;
    Order.getByUserId(userId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      return res.json(results);
    });
  },

  updateOrderStatus: (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    Order.updateStatus(id, status, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      return res.json({ message: 'Order status updated' });
    });
  }
};

module.exports = orderController;
