const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/all", orderController.getAllOrders); // Tạo đơn hàng
router.post("/", orderController.createOrder);

// Lấy đơn hàng theo order_code
router.get("/:orderCode", orderController.getOrderByOrderCode);

// Lấy danh sách đơn hàng của user
router.get("/user/:userId", orderController.getOrdersByUser);

// Cập nhật trạng thái đơn hàng
router.put("/:id", orderController.updateOrderStatus);

router.delete("/:id", orderController.deleteOrder);

// Lấy tất cả đơn hàng (admin)

module.exports = router;
