const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/', imageController.getByProductId); 
router.post('/', imageController.create);
router.delete('/:id', imageController.remove);

module.exports = router;
