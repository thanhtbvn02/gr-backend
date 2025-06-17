
const DetailService = require('../services/detailService');

const detailController = {
  getById: async (req, res) => {
    try {
      const { product_id } = req.query;
      
      if (!product_id) {
        return res.status(400).json({ message: 'Thiếu parameter product_id' });
      }
      
      const details = await DetailService.getByProductId(product_id);
      return res.json(details);
    } catch (err) {
      console.error('Error getting details:', err);
      return res.status(500).json({ error: err.message });
    }
  },
  
  create: async (req, res) => {
    try {
      const { product_id, key_name, value } = req.body;
      
      if (!product_id || !key_name) {
        return res.status(400).json({ message: 'Thiếu product_id hoặc key_name' });
      }
      
      const newDetail = await DetailService.create(product_id, key_name, value);
      return res.status(201).json({ 
        message: 'Detail created', 
        id: newDetail.id 
      });
    } catch (err) {
      console.error('Error creating detail:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id, product_id, key_name, value } = req.body;
      
      if (!id || !product_id || !key_name) {
        return res.status(400).json({ message: 'Thiếu id, product_id hoặc key_name' });   
      }
      
      const updatedDetail = await DetailService.update(id, product_id, key_name, value);
      return res.json({ 
        message: 'Detail updated', 
        id: updatedDetail.id 
      }); 
    } catch (err) {
      console.error('Error updating detail:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: 'Thiếu id' });
      }
      
      const deleted = await DetailService.remove(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Detail not found' });
      }
      
      return res.json({ message: 'Detail deleted' });
    } catch (err) {
      console.error('Error deleting detail:', err);
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = detailController;
