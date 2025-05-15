// const BaseController = require('./baseController');
// const orderItemService = require('../services/orderItemService');

// class OrderItemController extends BaseController {
//   constructor() {
//     super(orderItemService);
//   }

//   async getByOrderId(req, res) {
//     try {
//       const items = await this.service.getByOrderId(req.params.orderId);
//       res.json(items);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
  

//   async createOrderItems(req, res) {
//     try {
//       const items = await this.service.createOrderItems(req.body);
//       res.status(201).json(items);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async updateOrderItem(req, res) {
//     try {
//       const result = await this.service.updateOrderItem(req.params.id, req.body);
//       if (result[0] > 0) {
//         res.json({ message: 'Order item updated successfully' });
//       } else {
//         res.status(404).json({ message: 'Order item not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async deleteOrderItem(req, res) {
//     try {
//       const success = await this.service.deleteOrderItem(req.params.id);
//       if (success) {
//         res.status(204).send();
//       } else {
//         res.status(404).json({ message: 'Order item not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async getOrderItemsWithDetails(req, res) {
//     try {
//       const items = await this.service.getOrderItemsWithDetails(req.params.orderId);
//       res.json(items);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// module.exports = new OrderItemController(); 