const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Product = require('../models/productModel');
const sequelize = require('../config/db');

const orderService = {
    create: async (orderData) => {
        const { user_id, address_id, total_amount, status, payment_method, message } = orderData;

        const newOrder = await Order.create({
            user_id,
            address_id,
            total_amount,
            status,
            payment_method,
            message
        });

        return newOrder;
    },
    getOrdersByUserId: async (userId) => {
        const orders = await Order.findAll({
            where: { user_id: userId },
        });
        return orders;
    },
    getOrderById: async (orderId) => {
        const order = await Order.findByPk(orderId);
        return order;
    },
    updateOrder: async (orderId, orderData) => {
        const [updatedRows] = await Order.update(orderData, { where: { id: orderId } });
        return updatedRows;
    },
    deleteOrder: async (orderId) => {
        const deletedRows = await Order.destroy({ where: { id: orderId } });
        return deletedRows;
    },
    getOrderItemsByOrderId: async (orderId) => {
        const orderItems = await OrderItem.findAll({
            where: { order_id: orderId },
            include: [{
                model: Product,
                as: 'product'
            }]
        });
        return orderItems;
    },
    createOrderWithItems: async (orderData) => {
        const { user_id, address_id, payment_method, message, orderItems } = orderData;
        
        // Tính tổng tiền từ các sản phẩm
        const total_amount = orderItems.reduce((sum, item) => {
            return sum + (item.quantity * item.unit_price);
        }, 0);
        
        try {
            // Tạo transaction
            const result = await sequelize.transaction(async (t) => {
                // Tạo order
                const newOrder = await Order.create({
                    user_id,
                    address_id,
                    total_amount,
                    status: 'pending',
                    payment_method: payment_method || 'cash_on_delivery',
                    message
                }, { transaction: t });
                
                // Tạo các order item
                const orderItemPromises = orderItems.map(item => 
                    OrderItem.create({
                        order_id: newOrder.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        unit_price: item.unit_price
                    }, { transaction: t })
                );
                
                await Promise.all(orderItemPromises);
                
                return newOrder;
            });
            
            return result;
        } catch (error) {
            console.error('Error in createOrderWithItems:', error);
            throw error;
        }
    }
};

module.exports = orderService;
