const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Image = require('../models/imageModel');
const Detail = require('../models/detailModel');
const Ingredient = require('../models/ingredientModel');

// Thiết lập mối quan hệ
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' });
Category.hasMany(Product, { foreignKey: 'category_id' });

Product.hasMany(Image, { foreignKey: 'product_id' });
Image.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(Detail, { foreignKey: 'product_id' });
Detail.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(Ingredient, { foreignKey: 'product_id' });
Ingredient.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  Product,
  Category,
  Image,
  Detail,
  Ingredient
};

