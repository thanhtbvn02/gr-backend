const Image = require('../models/imageModel');

const imageController = {
  getByProductId: (req, res) => {
    const { product_id } = req.query;
    Image.getByProductId(product_id, (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    });
  },

  create: (req, res) => {
    const { product_id, url } = req.body;
    Image.create(product_id, url, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Image added', id: result.insertId });
    });
  },

  remove: (req, res) => {
    const { id } = req.params;
    Image.delete(id, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Image deleted' });
    });
  }
};

module.exports = imageController;
