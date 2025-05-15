const Ingredient = require('../models/ingredientModel');
const { update } = require('./detailService');

const IngredientService = {
  getByProductId: async (productId) => {
    return await Ingredient.findAll({
      where: { product_id: productId },
      order: [['id', 'ASC']]
    });
  },

  create: async (productId, name, quantity) => {
    return await Ingredient.create({
      product_id: productId,
      name: name,
      quantity: quantity
    });
  },
  
  update: async (id, productId, name, quantity) => {
    return await Ingredient.update({
      product_id: productId,
      name: name,
      quantity: quantity
    }, { where: { id } });
  },

  remove: async (id) => {
    return await Ingredient.destroy({
      where: { id }
    });
  }
};

module.exports = IngredientService;
