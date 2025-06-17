const express = require('express');
const router = express.Router();
const categoryController =  require('../controllers/categoryController');
router.get('/tree' , categoryController.getTree);

router.get('/tree-with-counts', categoryController.getTreeWithCounts);

router.get('/' , categoryController.getRootCategories);
router.get('/:id' , categoryController.getChildrenByParentId);

module.exports = router;
