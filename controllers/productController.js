// Op (Operators) là một đối tượng từ Sequelize cung cấp các toán tử để thực hiện các truy vấn phức tạp
// Ví dụ: Op.like để tìm kiếm theo mẫu, Op.gt để so sánh lớn hơn, Op.lt để so sánh nhỏ hơn,...
const { Op } = require('sequelize');
const Product = require('../models/productModel');
const productService = require('../services/productService');

const productController = {
  getAll: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  },

  create: async (req, res) => {
    try {
      const productData = {
        name: req.body.name,
        unit: req.body.unit,
        price: req.body.price,
        description: req.body.description || '',
        uses: req.body.uses || '',
        how_use: req.body.how_use || '',
        side_effects: req.body.side_effects || '',
        notes: req.body.notes || '',
        preserve: req.body.preserve || '',
        stock: req.body.stock || 0,
        category_id: req.body.category_id
      };

      const newProduct = await Product.create(productData);
      res.status(201).json({ 
        message: 'Tạo sản phẩm thành công', 
        product: newProduct 
      });
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ 
        message: 'Lỗi server khi tạo sản phẩm', 
        error: err.message 
      });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    try {
      const [updated] = await Product.update(req.body, {
        where: { id },
      });

      if (!updated) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }

      res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi cập nhật', error: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await Product.destroy({
        where: { id },
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }

      res.json({ message: 'Xóa thành công' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi xóa', error: err });
    }
  },

  getByCategory: async (req, res) => {
    const { id } = req.params;
    try {
      const products = await productService.searchByCategory(id);
      res.json(products);
    } catch (err) {
      console.error('Error getting products by category:', err);
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  },

  search: async (req, res) => {
    const { keyword } = req.query;
    try {
      const products = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },
      });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  },

  updateStock: async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
      const [updated] = await Product.update({ stock: quantity }, { where: { id } });

      if (!updated) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }

      res.json({ message: 'Cập nhật tồn kho thành công' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi cập nhật tồn kho', error: err });
    }
  },

  getPaginated: async (req, res) => {
    const { page, limit = 10, offset } = req.query;
    try {
      let queryOptions = {
        limit: parseInt(limit)
      };

      if (offset !== undefined) {
        queryOptions.offset = parseInt(offset);
      } else if (page !== undefined) {
        queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
      }

      const products = await Product.findAndCountAll(queryOptions);
      
      if (products.rows.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }

      const response = {
        total: products.count,
        products: products.rows
      };

      if (page !== undefined) {
        response.pages = Math.ceil(products.count / parseInt(limit));
        response.currentPage = parseInt(page);
      }

      res.json(response);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  },

  countAll: async (req, res) => {
    try {
      const count = await Product.count();
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  },

  countByCategory: async (req, res) => {
    const { category_id } = req.params;
    try {
      const count = await Product.count({
        where: { category_id }
      });
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  },

  countByPriceRange: async (req, res) => {
    const { min, max } = req.query;
    try {
      const count = await Product.count({
        where: {
          price: {
            [Op.between]: [parseFloat(min), parseFloat(max)]
          }
        }
      });
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err });
    }
  }
};

module.exports = productController;
