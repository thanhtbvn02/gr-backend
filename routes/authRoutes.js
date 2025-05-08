const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Truy cập thành công!', userId: req.user.userId });
});

module.exports = router;
