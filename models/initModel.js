//Models
const { Cart } = require('./cartMolde');
const { Category } = require('./categoryModel');
const { Order } = require('./orderModel');
const { ProductImg } = require('./productImg');
const { Product } = require('./productModel');
const { ProductsInCart } = require('./productsInCartModel');
const { User } = require('./userModel');

// Establish your models relations inside this function
const initModels = () => {
  // 1 User <--> M Product
  User.hasMany(Product);
  Product.belongsTo(User);

  // 1 User <--> M Order
  User.hasMany(Order);
  Order.belongsTo(User);

  // 1 User <--> 1 Cart
  User.hasOne(Cart);
  Cart.belongsTo(User);

  // 1 Product <--> M ProductImg
  Product.hasMany(ProductImg);
  ProductImg.belongsTo(Product);

  // 1 Category  <--> 1 Product
  Category.hasOne(Product);
  Product.belongsTo(Category);

  // 1 Cart <--> M ProductsInCart
  Cart.hasMany(ProductsInCart);
  ProductsInCart.belongsTo(Cart);

  // 1 Product <--> 1 ProductsInCart
  Product.hasOne(ProductsInCart);
  ProductsInCart.belongsTo(Product);

  // 1 Cart <--> 1 Order
  Cart.hasOne(Order);
  Order.belongsTo(Cart);
};

module.exports = { initModels };
