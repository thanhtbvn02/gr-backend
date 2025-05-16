const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');
const authMiddleware = require('../middlewares/authMiddleware');

// Lấy tất cả order item theo order ID
router.get('/order/:orderId', orderItemController.getByOrderId);

// Tạo order item mới
router.post('/', authMiddleware.authenticateToken, orderItemController.createOrderItem);

// Cập nhật order item
router.put('/:id', authMiddleware.authenticateToken, orderItemController.updateOrderItem);

// Xóa order item
router.delete('/:id', authMiddleware.authenticateToken, orderItemController.deleteOrderItem);

module.exports = router; 