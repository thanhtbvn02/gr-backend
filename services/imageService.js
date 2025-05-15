const Image = require('../models/imageModel');

const ImageService = {
  getByProductId: async (productId) => {
    return await Image.findAll({
      where: { product_id: productId },
      order: [['id', 'ASC']]
    });
  },

  create: async (productId, url) => {
    return await Image.create({
      product_id: productId,
      url: url
    });
  },

  remove: async (id) => {
    return await Image.destroy({
      where: { id }
    });
  }
};

module.exports = ImageService;
