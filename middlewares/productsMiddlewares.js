// Models
const { Product } = require('../models/productModel');
const { ProductsInCart } = require('../models/productsInCartModel');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const productExists = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findOne({
    where: { id: productId, status: 'active' },
  });

  if (!product) {
    return next(new AppError('Product does not exist with given Id', 404));
  }

  req.productData = product;

  next();
});

const productInventory = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const productInv = await Product.findOne({
    where: { id: productId, status: 'active' },
  });

  if (productInv.quantity < quantity) {
    return next(new AppError('product exceeds inventory limit', 404));
  }

  if (productInv.status !== 'active') {
    return next(new AppError('The product is not available', 404));
  }

  req.productInv = productInv;

  next();
});

module.exports = {
  productExists,
  productInventory,
};
