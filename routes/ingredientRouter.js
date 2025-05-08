const express = require('express');
const ingredientController = require('../controllers/ingredientController');
const router = express.Router();

router.get('/' ,ingredientController.getById)

module.exports = router;