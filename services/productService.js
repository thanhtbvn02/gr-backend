const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const CategoryService = require('./categoryService');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

const productService = {
  findAll: async () => {
    return await Product.findAll({
        include: [
            {
                model: Category,
                as: 'Category',
                attributes: ['name']
            }
        ]
    })
  },
  findById: async (id) => {
    return await Product.findByPk(id, {
        include: [
            {
                model: Category,
                as: 'Category',
                attributes: ['name']
            }
        ]
    });
  },

  searchByName: async (name) => {
    return await Product.findAll({
        where: { 
            name: {
                [Op.like]: `%${name}%` } },
        include: [
            { 
                model: Category, 
                as: 'Category', 
                attributes: ['name'] 
            }
        ]
    });
  },

  searchByCategory: async (categoryId) =>{
    const findAllCategories = async (categoryId) => {
        const subCategories = [categoryId];

    const findChildren = async (categoryId) => {   
        const children = await Category.findAll({
            where: { parent_id: categoryId }
        });
        for (const child of children) {
            subCategories.push(child.id);
            await findChildren(child.id);
        }
    };
    await findChildren(categoryId);
    return subCategories;     
    };
    const categoryIds = await findAllCategories(categoryId);
    return await Product.findAll({
        where: { 
            category_id: { 
            [Op.in]: categoryIds 
        } 
    },
        order: [['id', 'ASC']],
        limit: 100
    });
  },

  getPaginated: async (offset = 0, limit = 10) => {
      return await Product.findAll({
          order: [['id', 'ASC']],
          limit,
          offset
      });
  },

  create: async (productData) => {
      return await Product.create(productData);
  },

  update: async (id, productData) => {
      return await Product.update(productData, { 
          where: { id } 
      });
  },      

  remove: async (id) => {
      return await Product.destroy({ 
          where: { id } 
      });
  },

  count: async () => {
      return await Product.count();
  },

  countByCategory: async (categoryId) => {
      const categoryIds = await CategoryService.getAllChildCategoryIds(categoryId);
      return await Product.count({
        where: { category_id: { [Op.in]: categoryIds } }
      });
    },

  countByPriceRange: async (min, max) => {
      return await Product.count({
          where: { price: { [Op.between]: [min, max] } }
      });
  },

  getCategoryTreeWithCounts: async () => {
    const [results] = await sequelize.query(`
      WITH RECURSIVE category_tree AS (
        SELECT c.id, c.name, c.parent_id, 0 AS level
        FROM categories c
        WHERE c.parent_id IS NULL
        UNION ALL
        SELECT c.id, c.name, c.parent_id, ct.level + 1
        FROM categories c
        JOIN category_tree ct ON c.parent_id = ct.id
      ),
      category_counts AS (
        SELECT c.id, COUNT(p.id) AS product_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id
      )
      SELECT ct.*, COALESCE(cc.product_count, 0) AS count
      FROM category_tree ct
      LEFT JOIN category_counts cc ON ct.id = cc.id
      ORDER BY ct.level, ct.id
    `);

    const buildTree = (items) => {
      const map = {};
      const roots = [];
      items.forEach(item => {
        map[item.id] = { ...item, children: [] };
      });

      items.forEach(item => {
        if (item.parent_id) {
          map[item.parent_id].children.push(map[item.id]);
        } else {
          roots.push(map[item.id]);
        }
      });
      return roots;
    };

    const tree = buildTree(results);

    function accumulateCounts(nodes) {
      nodes.forEach(node => {
        if (node.children.length) {
          accumulateCounts(node.children);
          const childrenSum = node.children.reduce((sum, ch) => sum + ch.count, 0);
          node.count += childrenSum;
        }
      });
    }

    accumulateCounts(tree);
    return tree;
  }
};

module.exports = productService;
