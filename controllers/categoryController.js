const Category = require('../models/categoryModel');

function buildTree(rows) {
  const map = {};
  rows.forEach(r => {
    map[r.id] = {
      id:         r.id,
      name:       r.name,
      parent_id:  r.parent_id,
      children:   []          
    };
  });

  const tree = [];
  rows.forEach(r => {
    if (r.parent_id) {
      map[r.parent_id].children.push(map[r.id]);  // dùng parent_id
    } else {
      tree.push(map[r.id]);
    }
  });
  return tree;
}

exports.getRootCategories = (req, res) => {
  Category.getRootCategories((err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

exports.getChildrenByParentId = (req, res) => {
  const parentId = parseInt(req.params.id);
  Category.getChildrenByParentId(parentId, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};

exports.getTree = (req, res) => {
  Category.getAllCategory((err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(buildTree(rows));
  });
};
