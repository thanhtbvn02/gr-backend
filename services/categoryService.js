const Category = require('../models/categoryModel');

const CategoryService = {
  getRootCategories: async () => {
    return await Category.findAll({
      where: {
        parent_id: null
      }
    });
  },

  getChildrenByParentId: async (parentId) => {
    return await Category.findAll({
      where: {
        parent_id: parentId
      }
    });
  },

  getAllCategories: async () => {
    return await Category.findAll({
      order: [
        ['parent_id', 'ASC'],
        ['id', 'ASC']
      ]
    });
  },

  buildTree: (categories) => {
    const map = {};
    categories.forEach(category => {
      map[category.id] = {
        id: category.id,
        name: category.name,
        parent_id: category.parent_id,
        children: [],
        count: 0
      };
    });

    const tree = [];
    categories.forEach(category => {
      if (category.parent_id) {
        map[category.parent_id].children.push(map[category.id]);
      } else {
        tree.push(map[category.id]);
      }
    });

    return tree;
  },

  accumulateCounts: (nodes) => {
    nodes.forEach(node => {
      if (node.children.length) {
        CategoryService.accumulateCounts(node.children);
        node.count += node.children.reduce((sum, ch) => sum + ch.count, 0);
      }
    });
  },

  getAllChildCategoryIds: async (categoryId) => {
    const subCategories = [categoryId];

    const findChildren = async (parentId) => {
      const children = await Category.findAll({ where: { parent_id: parentId } });
      for (const child of children) {
        subCategories.push(child.id);
        await findChildren(child.id);
      }
    };

    await findChildren(categoryId);
    return subCategories;
  }
};

module.exports = CategoryService;

