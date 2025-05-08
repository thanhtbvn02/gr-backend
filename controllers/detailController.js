const Detail = require('../models/detailModel');

const detailController = {

    getById: (req, res) => {
        const { product_id } = req.query;
        if (!product_id) {
          return res.status(400).json({ message: 'Thiếu parameter product_id' });
        }
        Detail.getByProductId(product_id, (err, rows) => {
          if (err) return res.status(500).json({ error: err });
          res.json(rows);
        });
      }

}


module.exports = detailController;