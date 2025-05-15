const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

// Kiểm tra xem user đã đăng nhập chưa, nếu chưa thì vẫn cho phép truy cập nhưng không gán req.user
// Không cần khai báo optionalAuth ở đây vì đã có trong authMiddleware

router.get('/', authMiddleware.optionalAuth, cartController.getById);
router.post('/', authMiddleware.authenticateToken, cartController.create);
router.put('/:id', authMiddleware.authenticateToken, cartController.update);
router.delete('/:id', authMiddleware.authenticateToken, cartController.delete);

module.exports = router;
