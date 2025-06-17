
const ImageService = require('../services/imageService');

const imageController = {
  getByProductId: async (req, res) => {
    try {
      const { product_id } = req.query;
      
      if (!product_id) {
        return res.status(400).json({ message: 'Thiếu product_id' });
      }
      
      const images = await ImageService.getByProductId(product_id);
      return res.json(images);
    } catch (err) {
      console.error('Error getting images:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { product_id, url } = req.body;
      
      if (!product_id || !url) {
        return res.status(400).json({ message: 'Thiếu product_id hoặc url' });
      }
      
      const newImage = await ImageService.create(product_id, url);
      return res.status(201).json({ 
        message: 'Image added', 
        id: newImage.id 
      });
    } catch (err) {
      console.error('Error creating image:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ message: 'Thiếu id' });
      }
      
      const deleted = await ImageService.remove(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      return res.json({ message: 'Image deleted' });
    } catch (err) {
      console.error('Error deleting image:', err);
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = imageController;

