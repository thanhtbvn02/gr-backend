const CategoryService = require("../services/categoryService");
const ProductService = require("../services/productService");

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
  getTreeWithCounts: async (req, res) => {
    try {
      const tree = await ProductService.getCategoryTreeWithCounts();
      return res.json(tree);
    } catch (err) {
      console.error("Error getting category tree with counts:", err);
      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = categoryController;
