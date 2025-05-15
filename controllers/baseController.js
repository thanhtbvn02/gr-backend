// class BaseController {
//   constructor(service) {
//     this.service = service;
//   }

//   async getAll(req, res) {
//     try {
//       const data = await this.service.findAll();
//       res.json(data);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async getById(req, res) {
//     try {
//       const data = await this.service.findById(req.params.id);
//       if (data) {
//         res.json(data);
//       } else {
//         res.status(404).json({ message: 'Not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async create(req, res) {
//     try {
//       const data = await this.service.create(req.body);
//       res.status(201).json(data);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async update(req, res) {
//     try {
//       const data = await this.service.update(req.params.id, req.body);
//       if (data) {
//         res.json(data);
//       } else {
//         res.status(404).json({ message: 'Not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async delete(req, res) {
//     try {
//       const success = await this.service.delete(req.params.id);
//       if (success) {
//         res.status(204).send();
//       } else {
//         res.status(404).json({ message: 'Not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// module.exports = BaseController; 