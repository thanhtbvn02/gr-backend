const orderService = require('../services/orderService');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');

const orderController = {
  createOrder: async (req, res) => {
    try {
      // Giả sử client gửi lên: { user_id, address_id, orderItems, message, payment_method }
      // orderItems: [ { product_id, quantity, unit_price }, ... ]
      const { user_id, address_id, orderItems, message, payment_method } = req.body;

      if (!user_id || !address_id || !Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json({ message: 'Missing required order information' });
      }

      const order = await orderService.createOrderWithItems({
        user_id,
        address_id,
        orderItems,
        message,
        payment_method
      });

      return res.status(201).json({ 
        message: 'Order created successfully', 
        order_id: order.id 
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Lấy thêm thông tin về các items trong order
      const orderItems = await orderService.getOrderItemsByOrderId(id);
      const orderData = {
        ...order.toJSON(),
        items: orderItems
      };
      
      return res.json(orderData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getOrdersByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await orderService.getOrdersByUserId(userId);
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      const updatedRows = await orderService.updateOrder(id, { status });
      
      if (updatedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      return res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRows = await orderService.deleteOrder(id);
      
      if (deletedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      return res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = orderController;
