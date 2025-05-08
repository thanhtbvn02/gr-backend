const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Tạo đơn hàng
router.post('/', orderController.createOrder);

// Lấy đơn hàng theo ID
router.get('/:id', orderController.getOrderById);

// Lấy danh sách đơn hàng của user
router.get('/user/:userId', orderController.getOrdersByUser);

// Cập nhật trạng thái đơn hàng
router.put('/:id', orderController.updateOrderStatus);

module.exports = router;
