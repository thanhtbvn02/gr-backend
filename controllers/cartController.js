const Cart = require('../models/cartModel');
const cartService = require('../services/cartService');

const cartController = {
    getById: async (req, res) => {
        try {
            // Nếu không có user (chưa đăng nhập), trả về mảng rỗng
            if (!req.user) {
                return res.json([]);
            }
            
            const userId = req.user.userId;
            const cart = await cartService.findByUserId(userId);
            res.json(cart);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    },
    create: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { productId, quantity } = req.body;
            
            if (!productId || !quantity) {
                return res.status(400).json({ 
                    message: 'Thiếu thông tin sản phẩm hoặc số lượng'
                });
            }
            
            const cartItem = await cartService.addToCart(userId, productId, quantity);
            res.status(201).json(cartItem);
        } catch (err) {
            console.error('Error creating cart:', err);
            res.status(500).json({ 
                message: 'Lỗi server khi tạo giỏ hàng', 
                error: err.message 
            });
        }
    },
    update: async (req, res) => {
        const { id } = req.params;
        const { quantity } = req.body;
        
        try {
            const updatedCart = await cartService.update(id, quantity);
            res.json(updatedCart);
        } catch (err) {
            res.status(500).json({ 
                message: 'Lỗi server khi cập nhật giỏ hàng', 
                error: err.message 
            });
        }
    },
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            await cartService.remove(id);
            res.json({ message: 'Giỏ hàng đã được xóa thành công' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server khi xóa giỏ hàng', error: err.message });
        }
    }
}

module.exports = cartController;
