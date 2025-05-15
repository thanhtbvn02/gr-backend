const express = require('express');
const { authenticateToken, optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Truy cập thành công!', userId: req.user.userId });
});

// Route không yêu cầu xác thực
router.get('/public', optionalAuth, (req, res) => {
  res.json({ message: 'Truy cập công khai', user: req.user || null });
});

module.exports = router;
