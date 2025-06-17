const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Image = require('../models/imageModel');
const Detail = require('../models/detailModel');
const Ingredient = require('../models/ingredientModel');

const User = require('../models/userModel');
const Addresses = require('../models/addressesModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Cart = require('../models/cartModel');

Product.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' });
Category.hasMany(Product, { foreignKey: 'category_id' });

Product.hasMany(Image, { foreignKey: 'product_id' });
Image.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(Detail, { foreignKey: 'product_id' });
Detail.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(Ingredient, { foreignKey: 'product_id' });
Ingredient.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(Addresses, { foreignKey: 'user_id' });
Addresses.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Addresses.hasMany(Order, { foreignKey: 'address_id' });
Order.belongsTo(Addresses, { foreignKey: 'address_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

Product.hasMany(Cart, { foreignKey: 'product_id' });
Cart.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  Product,
  Category,
  Image,
  Detail,
  Ingredient,
  User,
  Addresses,
  Order,
  OrderItem,
  Cart
};

