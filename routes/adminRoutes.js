const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// POST /api/admin/register
router.post('/register', adminController.register);

// POST /api/admin/login
router.post('/login', adminController.login);

module.exports = router;