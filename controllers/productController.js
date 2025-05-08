const Product = require('../models/productModel');

const productController = {
  getAll: (req, res) => {
    Product.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err });
      return res.json(results);
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    Product.getById(id, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (!results.length) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(results[0]);
    });
  },

  searchProducts: (req, res) => {
    const keyword = (req.query.query || '').trim();
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;
  
    if (!keyword) return res.status(400).json({ message: 'Thiếu query' });
  
    Product.searchByName(keyword, offset, limit, (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    });
  },  

  searchProductsByCategory: (req, res) => {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) return res.status(400).json({ message: 'categoryId không hợp lệ' });

    Product.searchByCategory(categoryId, (err, products) => {
      if (err) return res.status(500).json({ error: err });
      res.json(products);
    });
  },
  

  getPaginated: (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;
  
    Product.getPaginated(offset, limit, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  create: (req, res) => {
    const {
      category_id,
      name,
      unit,
      price,
      description,
      uses,
      how_use,
      side_effects,
      notes,
      preserve,
      stock
    } = req.body;

    Product.create(
      category_id,
      name,
      unit,
      price,
      description,
      uses,
      how_use,
      side_effects,
      notes,
      preserve,
      stock,
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        return res.status(201).json({ message: 'Product created', id: result.insertId });
      }
    );
  },

  update: (req, res) => {
    const { id } = req.params;
    const {
      category_id,
      name,
      unit,
      price,
      description,
      uses,
      how_use,
      side_effects,
      notes,
      preserve,
      stock
    } = req.body;

    Product.update(
      id,
      category_id,
      name,
      unit,
      price,
      description,
      uses,
      how_use,
      side_effects,
      notes,
      preserve,
      stock,
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ message: 'Product updated' });
      }
    );
  },

  remove: (req, res) => {
    const { id } = req.params;
    Product.remove(id, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      return res.json({ message: 'Product deleted' });
    });
  }
};

module.exports = productController;
