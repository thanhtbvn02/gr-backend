const Ingredient = require('../models/ingredientModel');

const ingredientController = {

    getById: (req, res) => {
        const { product_id } = req.query;
        if (!product_id) {
            return res.status(400).json({message: 'Thiếu parameter product_id'});
        }
        Ingredient.getByProductId(product_id, (err, rows) => {
            if (err) return res.status(500).json({error: err});
            res.json(rows);
        })
    }
}

module.exports = ingredientController;