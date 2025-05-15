const express = require('express');
const ingredientController = require('../controllers/ingredientController');
const router = express.Router();

router.get('/' ,ingredientController.getById)
router.post('/', ingredientController.create)
router.put('/:id', ingredientController.update)
router.delete('/:id', ingredientController.remove)

module.exports = router;