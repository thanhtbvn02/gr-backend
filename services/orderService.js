const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");
const Product = require("../models/productModel");

const orderService = {
  create: async (orderData, transaction) => {
    return await Order.create(
      orderData,
      transaction ? { transaction } : undefined
    );
  },

  getOrdersByUserId: async (userId) => {
    return await Order.findAll({ where: { user_id: userId } });
  },

  getOrderByOrderCode: async (orderCode) => {
    return await Order.findOne({ where: { order_code: orderCode } });
  },

  getOrderById: async (orderId, transaction) => {
    return await Order.findByPk(
      orderId,
      transaction ? { transaction } : undefined
    );
  },

  updateOrder: async (orderId, orderData, transaction) => {
    return await Order.update(orderData, {
      where: { id: orderId },
      ...(transaction && { transaction }),
    });
  },

  deleteOrder: async (orderId, transaction) => {
    return await Order.destroy({
      where: { id: orderId },
      ...(transaction && { transaction }),
    });
  },

  getOrderItemsByOrderId: async (orderId, transaction) => {
    return await OrderItem.findAll({
      where: { order_id: orderId },
      include: [{ model: Product, as: "product" }],
      ...(transaction && { transaction }),
    });
  },

  createOrderItem: async (orderItemData, transaction) => {
    return await OrderItem.create(
      orderItemData,
      transaction ? { transaction } : undefined
    );
  },

  getProductById: async (productId, transaction) => {
    return await Product.findByPk(
      productId,
      transaction ? { transaction } : undefined
    );
  },

  updateProductStock: async (productId, newStock, transaction) => {
    return await Product.update(
      { stock: newStock },
      {
        where: { id: productId },
        ...(transaction && { transaction }),
      }
    );
  },

  getAllOrders: async () => {
    return await Order.findAll({
      include: [
        { model: require("../models/userModel"), as: "User" },
        { model: require("../models/addressesModel"), as: "Address" },
      ],
      order: [["created_at", "DESC"]],
    });
  },
};

module.exports = orderService;
