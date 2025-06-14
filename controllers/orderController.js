// const orderService = require("../services/orderService");
// const Order = require("../models/orderModel");
// const OrderItem = require("../models/orderItemModel");

// const orderController = {
//   createOrder: async (req, res) => {
//     try {
//       const { user_id, address_id, orderItems, message, payment_method } =
//         req.body;

//       if (
//         !user_id ||
//         !address_id ||
//         !Array.isArray(orderItems) ||
//         orderItems.length === 0
//       ) {
//         return res
//           .status(400)
//           .json({ message: "Missing required order information" });
//       }

//       const order = await orderService.createOrderWithItems({
//         user_id,
//         address_id,
//         orderItems,
//         message,
//         payment_method,
//       });

//       return res.status(201).json({
//         message: "Order created successfully",
//         order_id: order.id,
//         order_code: order.order_code,
//       });
//     } catch (error) {
//       console.error("Error creating order:", error);
//       return res.status(500).json({ error: error.message });
//     }
//   },

//   getOrderByOrderCode: async (req, res) => {
//     try {
//       const { orderCode } = req.params;
//       const order = await orderService.getOrderByOrderCode(orderCode);

//       if (!order) {
//         return res.status(404).json({ message: "Order not found" });
//       }

//       const orderItems = await orderService.getOrderItemsByOrderId(order.id);
//       const orderData = {
//         ...order.toJSON(),
//         items: orderItems,
//         order_code: order.order_code,
//       };

//       return res.json(orderData);
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   },

//   getOrdersByUser: async (req, res) => {
//     try {
//       const { userId } = req.params;
//       const orders = await orderService.getOrdersByUserId(userId);
//       return res.json(orders);
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   },

//   updateOrderStatus: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;

//       if (!status) {
//         return res.status(400).json({ message: "Status is required" });
//       }

//       const updatedRows = await orderService.updateOrder(id, { status });

//       if (updatedRows === 0) {
//         return res.status(404).json({ message: "Order not found" });
//       }

//       return res.json({ message: "Order status updated successfully" });
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   },

//   deleteOrder: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const deletedRows = await orderService.deleteOrder(id);

//       if (deletedRows === 0) {
//         return res.status(404).json({ message: "Order not found" });
//       }

//       return res.json({ message: "Order deleted successfully" });
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   },

//   getAllOrders: async (req, res) => {
//     try {
//       const orders = await orderService.getAllOrders();
//       res.json(orders);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },
// };

// module.exports = orderController;
const sequelize = require("../config/db");
const orderService = require("../services/orderService");

const orderController = {
  createOrder: async (req, res) => {
    const { user_id, address_id, orderItems, message, payment_method } =
      req.body;
    if (
      !user_id ||
      !address_id ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    )
      return res
        .status(400)
        .json({ message: "Missing required order information" });

    try {
      await sequelize.transaction(async (t) => {
        // Tính tổng tiền
        const total_amount = orderItems.reduce(
          (sum, item) => sum + item.quantity * item.unit_price,
          0
        );

        // Sinh order_code duy nhất
        let order_code,
          isUnique = false;
        while (!isUnique) {
          order_code = Math.floor(
            1000000000 + Math.random() * 9000000000
          ).toString();
          const existed = await orderService.getOrderByOrderCode(order_code);
          if (!existed) isUnique = true;
        }

        // Tạo order
        const order = await orderService.create(
          {
            user_id,
            address_id,
            total_amount,
            status: "pending",
            payment_method: payment_method || "cash_on_delivery",
            message,
            order_code,
          },
          t
        );

        // Tạo item và trừ stock
        for (const item of orderItems) {
          await orderService.createOrderItem(
            {
              order_id: order.id,
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
            },
            t
          );

          const product = await orderService.getProductById(item.product_id, t);
          if (!product)
            throw new Error(
              `Không tìm thấy sản phẩm với id ${item.product_id}`
            );
          if (product.stock < item.quantity)
            throw new Error(`Sản phẩm ${product.name} không đủ hàng tồn kho`);
          await orderService.updateProductStock(
            item.product_id,
            product.stock - item.quantity,
            t
          );
        }

        res.status(201).json({
          message: "Order created successfully",
          order_id: order.id,
          order_code: order.order_code,
        });
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getOrderByOrderCode: async (req, res) => {
    try {
      const { orderCode } = req.params;
      const order = await orderService.getOrderByOrderCode(orderCode);
      if (!order) return res.status(404).json({ message: "Order not found" });

      const orderItems = await orderService.getOrderItemsByOrderId(order.id);
      const orderData = {
        ...order.toJSON(),
        items: orderItems,
        order_code: order.order_code,
      };
      res.json(orderData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOrdersByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await orderService.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateOrderStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    try {
      await sequelize.transaction(async (t) => {
        // Lấy đơn hiện tại
        const order = await orderService.getOrderById(id, t);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Nếu chuyển sang cancelled và chưa bị cancelled trước đó
        if (status === "cancelled" && order.status !== "cancelled") {
          // Hoàn lại stock cho từng sản phẩm trong đơn
          const items = await orderService.getOrderItemsByOrderId(id, t);
          for (const item of items) {
            const product = await orderService.getProductById(
              item.product_id,
              t
            );
            if (product) {
              await orderService.updateProductStock(
                product.id,
                product.stock + item.quantity,
                t
              );
            }
          }
        }

        // Cập nhật trạng thái đơn
        await orderService.updateOrder(id, { status }, t);
        res.json({ message: "Order status updated successfully" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteOrder: async (req, res) => {
    const { id } = req.params;
    try {
      await sequelize.transaction(async (t) => {
        // Lấy đơn hiện tại
        const order = await orderService.getOrderById(id, t);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Đơn chờ xác nhận hoặc đang xử lý, hoàn lại stock trước khi xoá
        if (order.status !== "cancelled" && order.status !== "delivered") {
          const items = await orderService.getOrderItemsByOrderId(id, t);
          for (const item of items) {
            const product = await orderService.getProductById(
              item.product_id,
              t
            );
            if (product) {
              await orderService.updateProductStock(
                product.id,
                product.stock + item.quantity,
                t
              );
            }
          }
        }

        await orderService.deleteOrder(id, t);
        res.json({ message: "Order deleted successfully" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = orderController;
