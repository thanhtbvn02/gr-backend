const db = require('../config/db');

const Category = {
  getRootCategories: (callback) => {
    const sql = `
      SELECT c.*
      FROM Categories c
      WHERE c.parent_id IS NULL
    `;
    db.query(sql, callback);
  },

  getChildrenByParentId: (parentId, callback) => {
    const sql = `
      SELECT c.*
      FROM Categories c
      WHERE c.parent_id = ?
    `;
    db.query(sql, [parentId], callback);
  },

  getAllCategory : (callback) => {
    const sql = `
    SELECT id, name, parent_id 
    FROM Categories c
    ORDER BY parent_id, id
    `
    db.query(sql, callback)
  }
  
};

module.exports = Category;
