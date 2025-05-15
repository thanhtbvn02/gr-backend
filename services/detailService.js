const Detail = require('../models/detailModel');

const DetailService = {
  getByProductId: async (productId) => {
    return await Detail.findAll({
      where: { product_id: productId },
      order: [['id', 'ASC']]
    });
  },

  create: async (productId, keyName, value) => {
    return await Detail.create({
      product_id: productId,
      key_name: keyName,
      value: value
    });
  },

  update: async (id, productId, keyName, value) => {
    return await Detail.update({
      product_id: productId,
      key_name: keyName,
      value: value
    }, { where: { id } });
  },

  remove: async (id) => {
    return await Detail.destroy({
      where: { id }
    });
  }
};

module.exports = DetailService;
