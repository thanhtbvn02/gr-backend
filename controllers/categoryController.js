// const Category = require('../models/categoryModel');

// function buildTree(rows) {
//   const map = {};
//   rows.forEach(r => {
//     map[r.id] = {
//       id:         r.id,
//       name:       r.name,
//       parent_id:  r.parent_id,
//       children:   []          
//     };
//   });

//   const tree = [];
//   rows.forEach(r => {
//     if (r.parent_id) {
//       map[r.parent_id].children.push(map[r.id]);  // dùng parent_id
//     } else {
//       tree.push(map[r.id]);
//     }
//   });
//   return tree;
// }

// exports.getRootCategories = (req, res) => {
//   Category.getRootCategories((err, rows) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(rows);
//   });
// };

// exports.getChildrenByParentId = (req, res) => {
//   const parentId = parseInt(req.params.id);
//   Category.getChildrenByParentId(parentId, (err, rows) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(rows);
//   });
// };

// exports.getTree = (req, res) => {
//   Category.getAllCategory((err, rows) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(buildTree(rows));
//   });
// };
const CategoryService = require('../services/categoryService');
const ProductService = require('../services/productService');

const categoryController = {
  getRootCategories: async (req, res) => {
    try {
      const categories = await CategoryService.getRootCategories();
      return res.json(categories);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  getChildrenByParentId: async (req, res) => {
    try {
      const parentId = parseInt(req.params.id);
      const categories = await CategoryService.getChildrenByParentId(parentId);
      return res.json(categories);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  getTree: async (req, res) => {
    try {
      const categories = await CategoryService.getAllCategories();
      const tree = CategoryService.buildTree(categories);
      return res.json(tree);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  // Thêm vào categoryController.js
  getTreeWithCounts: async (req, res) => {
    try {
      const tree = await ProductService.getCategoryTreeWithCounts();
      return res.json(tree);
    } catch (err) {
      console.error('Error getting category tree with counts:', err);
      return res.status(500).json({ error: err.message });
    }
  }
 

};

module.exports = categoryController;
