const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/order/:orderId', orderItemController.getByOrderId);

router.post('/', authMiddleware.authenticateToken, orderItemController.createOrderItem);

router.put('/:id', authMiddleware.authenticateToken, orderItemController.updateOrderItem);

router.delete("/:id", authMiddleware.authenticateToken, orderItemController.deleteOrderItem);

module.exports = router;