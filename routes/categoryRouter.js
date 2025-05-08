const express = require('express');
const router = express.Router();
const categoryController =  require('../controllers/categoryController');

router.get('/' , categoryController.getRootCategories);
router.get('/tree' , categoryController.getTree);
router.get('/:id' , categoryController.getChildrenByParentId);

module.exports = router;
