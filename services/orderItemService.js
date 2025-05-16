 const OrderItem = require('../models/orderItemModel');

const orderItemService = {
    create: async (orderItemData) => {
        const { order_id, product_id, quantity, unit_price } = orderItemData;

        const newOrderItem = await OrderItem.create({
            order_id,
            product_id,
            quantity,
            unit_price
        });

        return newOrderItem;
    },
    getOrderItemsByOrderId: async (orderId) => {
        const orderItems = await OrderItem.findAll({
            where: { order_id: orderId },
        });
        return orderItems;
    },
    updateOrderItem: async (orderItemId, orderItemData) => {
        const [updatedRows] = await OrderItem.update(orderItemData, { where: { id: orderItemId } });
        return updatedRows;
    },
    deleteOrderItem: async (orderItemId) => {
        const deletedRows = await OrderItem.destroy({ where: { id: orderItemId } });
        return deletedRows;
    }
};

module.exports = orderItemService;