const Addresses = require('../models/addressesModel');

const addressesService = {
  create: async (addressData) => {
    const { user_id, is_default } = addressData;

    // Kiểm tra số lượng địa chỉ hiện có
    const existingCount = await Addresses.count({ where: { user_id } });

    // Nếu người dùng chọn là mặc định
    if (is_default === true) {
      await Addresses.update({ is_default: false }, { where: { user_id } });
      addressData.is_default = true;
    } else {
      // Nếu là địa chỉ đầu tiên → tự đặt là mặc định
      addressData.is_default = existingCount === 0;
    }

    const newAddress = await Addresses.create(addressData);
    return newAddress;
  },

  getById: async (id) => {
    return await Addresses.findByPk(id);
  },

  getByUserId: async (userId) => {
    return await Addresses.findAll({ where: { user_id: userId } });
  },

  setDefault: async (id) => {
    const address = await Addresses.findByPk(id);
    if (!address) return null;

    await Addresses.update({ is_default: false }, { where: { user_id: address.user_id } });
    await address.update({ is_default: true });

    return address;
  },

  update: async (id, addressData) => {
    return await Addresses.update(addressData, { where: { id } });
  },

  delete: async (id) => {
    return await Addresses.destroy({ where: { id } });
  },
};

module.exports = addressesService;
