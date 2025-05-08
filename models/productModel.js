const db = require('../config/db');

const Product = {
  // Lấy tất cả sản phẩm
  getAll: (callback) => {
    const sql = `
      SELECT p.*, c.name AS category_name
      FROM Products p
      JOIN Categories c ON p.category_id = c.id
    `;
    db.query(sql, callback);
  },

  // Lấy sản phẩm theo ID
  getById: (id, callback) => {
    const sql = `
      SELECT p.*, c.name AS category_name
      FROM Products p
      JOIN Categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    db.query(sql, [id], callback);
  },

  searchByName(keyword, offset, limit, cb) {
    const sql = `
      SELECT  p.*, c.name AS category_name
      FROM    Products AS p
      LEFT JOIN Categories AS c ON p.category_id = c.id
      WHERE   p.name LIKE CONCAT('%', ?, '%')
      COLLATE utf8mb4_unicode_ci
      LIMIT ? OFFSET ?;
    `;
    db.query(sql, [keyword, limit, offset], cb);
  },  

  searchByCategory11: (id,callback) => {
    const sql = `
      SELECT p.*, c.name AS category_name
      FROM Products p
      JOIN Categories c ON p.category_id = c.id
      WHERE p.category_id = ? 
    `;
    db.query(sql, [id], callback);
  },

  searchByCategory: (categoryId,callback) => {
    const sql = `
      WITH RECURSIVE subcats AS (
        SELECT id FROM Categories WHERE id = ?
        UNION ALL
        SELECT c.id FROM Categories c
          JOIN subcats s ON c.parent_id = s.id
      )
      SELECT p.*
      FROM Products p
      WHERE p.category_id IN (SELECT id FROM subcats)
      ORDER BY p.id
      LIMIT 100; 
    `;
    db.query(sql, [categoryId], callback);
  },

  getPaginated: (offset, limit, callback) => {
    const sql = `
      SELECT * FROM Products
      ORDER BY id ASC
      LIMIT ? OFFSET ?
    `;
    db.query(sql, [limit, offset], callback);
  },
  
  create: (
    category_id,
    name,
    unit,
    price,
    description,
    uses,
    how_use,
    side_effects,
    notes,
    preserve,
    stock,
    callback
  ) => {
    const sql = `
      INSERT INTO Products (
        category_id, name, unit, price, description, uses, how_use,
        side_effects, notes, preserve, stock
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      category_id,
      name,
      unit,
      price,
      description,
      uses,
      how_use,
      side_effects,
      notes,
      preserve,
      stock
    ];
    db.query(sql, values, callback);
  },

  update: (
    id,
    category_id,
    name,
    unit,
    price,
    description,
    uses,
    how_use,
    side_effects,
    notes,
    preserve,
    stock,
    callback
  ) => {
    const sql = `
      UPDATE Products
      SET category_id = ?,
          name = ?,
          unit = ?,
          price = ?,
          description = ?,
          uses = ?,
          how_use = ?,
          side_effects = ?,
          notes = ?,
          preserve = ?,
          stock = ?
      WHERE id = ?
    `;
    const values = [
      category_id,
      name,
      unit,
      price,
      description,
      uses,
      how_use,
      side_effects,
      notes,
      preserve,
      stock,
      id
    ];
    db.query(sql, values, callback);
  },

  remove: (id, callback) => {
    const sql = 'DELETE FROM Products WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Product;
