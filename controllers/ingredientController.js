// const Ingredient = require('../models/ingredientModel');

// const ingredientController = {

//     getById: (req, res) => {
//         const { product_id } = req.query;
//         if (!product_id) {
//             return res.status(400).json({message: 'Thiếu parameter product_id'});
//         }
//         Ingredient.getByProductId(product_id, (err, rows) => {
//             if (err) return res.status(500).json({error: err});
//             res.json(rows);
//         })
//     }
// }

// module.exports = ingredientController;

const IngredientService = require('../services/ingredientService');

const ingredientController = {
  getById: async (req, res) => {
    try {
      const { product_id } = req.query;
      
      if (!product_id) {
        return res.status(400).json({ message: 'Thiếu parameter product_id' });
      }
      
      const ingredients = await IngredientService.getByProductId(product_id);
      return res.json(ingredients);
    } catch (err) {
      console.error('Error getting ingredients:', err);
      return res.status(500).json({ error: err.message });
    }
  },
  
  create: async (req, res) => {
    try {
      const { product_id, name, quantity } = req.body;
      
      if (!product_id || !name) {
        return res.status(400).json({ message: 'Thiếu product_id hoặc name' });
      }
      
      const newIngredient = await IngredientService.create(product_id, name, quantity);
      return res.status(201).json({ 
        message: 'Ingredient created', 
        id: newIngredient.id 
      });
    } catch (err) {
      console.error('Error creating ingredient:', err);
      return res.status(500).json({ error: err.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id, product_id, name, quantity } = req.body;
      
      if (!id || !product_id || !name ) {
        return res.status(400).json({ message: 'Thiếu id, product_id hoặc name' });
      }
      
      const updatedIngredient = await IngredientService.update(id, product_id, name, quantity);
      return res.json({ 
        message: 'Ingredient updated', 
        id: updatedIngredient.id 
      });
    } catch (err) {
      console.error('Error updating ingredient:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: 'Thiếu id' });
      }
      
      const deleted = await IngredientService.remove(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Ingredient not found' });
      }
      
      return res.json({ message: 'Ingredient deleted' });
    } catch (err) {
      console.error('Error deleting ingredient:', err);
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ingredientController;
