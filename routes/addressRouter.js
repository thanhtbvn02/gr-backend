const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

router.post('/', addressController.create);
router.get('/user/:user_id', addressController.getByUserId);
router.get('/:id', addressController.getById);
router.put('/:id/default', addressController.setDefault);
router.put('/:id', addressController.update);
router.delete('/:id', addressController.delete);

module.exports = router;

