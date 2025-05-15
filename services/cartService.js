const Cart = require('../models/cartModel');
const sequelize = require('../config/db');

const cartService = {
    findByUserId: async (userId) => {
        return await Cart.findAll({
            where: { user_id: userId }
        });
    },
    findByUserIdAndProductId: async (userId, productId) => {
        return await Cart.findOne({
            where: { 
                user_id: userId,
                product_id: productId
            }
        });
    },
    create: async (userId, productId, quantity) => {
        return await Cart.create({
            user_id: userId,
            product_id: productId,
            quantity: quantity
        });
    },
    addToCart: async (userId, productId, quantity) => {
        try {
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingItem = await cartService.findByUserIdAndProductId(userId, productId);
            
            if (existingItem) {
                // Nếu đã có, cập nhật số lượng
                await Cart.update(
                    { quantity: existingItem.quantity + quantity },
                    { where: { id: existingItem.id } }
                );
                return await cartService.findByUserIdAndProductId(userId, productId);
            } else {
                // Nếu chưa có, tạo mới
                return await cartService.create(userId, productId, quantity);
            }
        } catch (error) {
            console.error('Error in addToCart:', error);
            throw error;
        }
    },
    update: async (id, quantity) => {
        return await Cart.update({
            quantity: quantity
        }, {
            where: { id: id }
        });
    },
    remove: async (id) => {
        return await Cart.destroy({
            where: { id: id }
        });
    },
    
};

module.exports = cartService;