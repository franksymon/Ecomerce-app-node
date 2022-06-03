//Models
const { Product } = require('../models/productModel');
const { Category } = require('../models/categoryModel');
const { User } = require('../models/userModel');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, quantity, categoryId } = req.body;
  const { sessionUser } = req;

  const newProduct = await Product.create({
    title,
    description,
    price,
    quantity,
    categoryId,
    userId: sessionUser.id,
  });

  res.status(201).json({ newProduct });
});

const getAllProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findAll({
    where: { status: 'active' },
    include: [
      { model: Category, attributes: ['name'] },
      { model: User, attributes: ['userName', 'email'] },
    ],
  });

  res.status(200).json(product);
});

const getProductById = catchAsync(async (req, res, next) => {
  const { productData } = req;

  res.status(200).json({ productData });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { productData } = req;
  const { title, description, price, quantit } = req.body;

  await productData.update({ title, description, price, quantit });

  res.status(200).json({ status: 'success' });
});

const deletedProduct = catchAsync(async (req, res, next) => {
  const { productData } = req;

  await productData.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deletedProduct,
};
