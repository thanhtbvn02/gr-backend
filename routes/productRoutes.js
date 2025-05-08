const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.get('/search', productController.searchProducts); 

router.get('/paginate', productController.getPaginated);

router.get('/category/:id', productController.searchProductsByCategory);
// GET all
router.get('/', productController.getAll);


// GET by ID
router.get('/:id', productController.getById);

// CREATE
router.post('/', productController.create);

// UPDATE
router.put('/:id', productController.update);

// DELETE
router.delete('/:id', productController.remove);

module.exports = router;
