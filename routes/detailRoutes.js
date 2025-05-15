const express = require('express');
const router = express.Router();
const detailController = require('../controllers/detailController');

router.get('/' , detailController.getById)
router.post('/', detailController.create)
router.put('/:id', detailController.update)
router.delete('/:id', detailController.remove)

module.exports = router;