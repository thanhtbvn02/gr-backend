const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminController = {
  register: (req, res) => {
    const { name, username, password } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Error hashing password' });
      }
      Admin.create(name, username, hashedPassword, (err2, result) => {
        if (err2) {
          return res.status(500).json({ message: 'Error creating admin', error: err2 });
        }
        return res.status(201).json({ message: 'Admin created successfully' });
      });
    });
  },

  login: (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    Admin.findByUsername(username, (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!results || results.length === 0) {
        return res.status(400).json({ message: 'Admin not found' });
      }

      const adminData = results[0];
      bcrypt.compare(password, adminData.password, (err2, isMatch) => {
        if (err2) return res.status(500).json({ message: 'Password compare error' });
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ adminId: adminData.id }, 'ADMIN_SECRET_KEY', { expiresIn: '1d' });
        return res.status(200).json({
          message: 'Admin login successful',
          token,
          admin: { id: adminData.id, name: adminData.name, username: adminData.username }
        });
      });
    });
  }
};

module.exports = adminController;
