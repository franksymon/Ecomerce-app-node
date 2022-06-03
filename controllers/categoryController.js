//Models
const { Category } = require('../models/categoryModel');
const { Product } = require('../models/productModel');
const { User } = require('../models/userModel');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const getAllCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findAll({
    where: { status: 'active' },
    include: [
      {
        model: Product,
        attributes: ['title', 'id'],
        include: [{ model: User, attributes: ['id', 'userName'] }],
      },
    ],
  });

  res.status(200).json({ category });
});

const getCategoryById = catchAsync(async (req, res, next) => {
  const { categoryData } = req;

  res.status(200).json({ categoryData });
});

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (name.length === 0) {
    return next(new AppError('Name cannot be empty', 400));
  }

  const newCategory = await Category.create({ name });

  res.status(201).json({ newCategory });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { categoryData } = req;

  const { name } = req.body;

  await categoryData.update({ name });

  res.status(200).json({ status: 'success' });
});

const deletedCategory = catchAsync(async (req, res, next) => {
  const { categoryData } = req;

  await categoryData.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  getAllCategory,
  createCategory,
  updateCategory,
  deletedCategory,
  getCategoryById,
};
