const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/all", orderController.getAllOrders);
router.post("/", orderController.createOrder);

router.get("/:orderCode", orderController.getOrderByOrderCode);

router.get("/user/:userId", orderController.getOrdersByUser);

router.put("/:id", orderController.updateOrderStatus);

router.delete("/:id", orderController.deleteOrder);

module.exports = router;
