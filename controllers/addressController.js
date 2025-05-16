const addressesService = require('../services/addressesService');

const addressController = {
  create: async (req, res) => {
    try {
      const {
        user_id,
        recipient_name,
        phone,
        province,
        district,
        ward,
        street,
        is_default
      } = req.body;

      if (!user_id || !recipient_name || !phone || !province || !district || !ward || !street) {
        return res.status(400).json({ message: 'Thiếu thông tin địa chỉ bắt buộc' });
      }

      const addressData = {
        user_id,
        recipient_name,
        phone,
        province,
        district,
        ward,
        street,
        is_default: is_default === true  // cho phép gửi tùy chọn
      };

      const address = await addressesService.create(addressData);
      res.status(201).json(address);
    } catch (error) {
      console.error('Error creating address:', error);
      res.status(500).json({ message: 'Lỗi tạo địa chỉ', error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const address = await addressesService.getById(id);
      if (!address) {
        return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
      }
      res.status(200).json(address);
    } catch (error) {
      console.error('Error getting address by ID:', error);
      res.status(500).json({ message: 'Lỗi lấy địa chỉ theo ID', error: error.message });
    }
  },

  getByUserId: async (req, res) => {
    try {
      const { user_id } = req.params;
      const addresses = await addressesService.getByUserId(user_id);
      res.status(200).json(addresses);
    } catch (error) {
      console.error('Error getting addresses by user ID:', error);
      res.status(500).json({ message: 'Lỗi lấy danh sách địa chỉ', error: error.message });
    }
  },

  setDefault: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await addressesService.setDefault(id);
      if (!updated) {
        return res.status(404).json({ message: 'Không tìm thấy địa chỉ để đặt mặc định' });
      }
      res.status(200).json(updated);
    } catch (error) {
      console.error('Error setting default address:', error);
      res.status(500).json({ message: 'Lỗi đặt địa chỉ mặc định', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        recipient_name,
        phone,
        province,
        district,
        ward,
        street
      } = req.body;

      if (!recipient_name || !phone || !province || !district || !ward || !street) {
        return res.status(400).json({ message: 'Thiếu thông tin địa chỉ cần cập nhật' });
      }

      const addressData = {
        recipient_name,
        phone,
        province,
        district,
        ward,
        street
      };

      const result = await addressesService.update(id, addressData);

      if (result[0] === 0) {
        return res.status(404).json({ message: 'Không tìm thấy địa chỉ để cập nhật' });
      }

      res.status(200).json({ message: 'Cập nhật địa chỉ thành công' });
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ message: 'Lỗi cập nhật địa chỉ', error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await addressesService.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Không tìm thấy địa chỉ để xoá' });
      }
      res.status(200).json({ message: 'Xoá địa chỉ thành công' });
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ message: 'Lỗi xoá địa chỉ', error: error.message });
    }
  },
};

module.exports = addressController;
