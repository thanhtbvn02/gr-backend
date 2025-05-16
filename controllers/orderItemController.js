const OrderItem = require('../models/orderItemModel');
const orderItemService = require('../services/orderItemService');

const orderItemController = {
  getByOrderId: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const items = await orderItemService.getOrderItemsByOrderId(orderId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createOrderItem: async (req, res) => {
    try {
      const orderItemData = req.body;
      const item = await orderItemService.create(orderItemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateOrderItem: async (req, res) => {
    try {
      const id = req.params.id;
      const orderItemData = req.body;
      const result = await orderItemService.updateOrderItem(id, orderItemData);
      
      if (result > 0) {
        res.json({ message: 'Order item updated successfully' });
      } else {
        res.status(404).json({ message: 'Order item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteOrderItem: async (req, res) => {
    try {
      const id = req.params.id;
      const success = await orderItemService.deleteOrderItem(id);
      
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Order item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = orderItemController; 