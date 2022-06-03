//Models
const { Category } = require('../models/categoryModel');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const categoryExists = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findOne({
    where: { id: categoryId, status: 'active' },
  });

  if (!category) {
    return next(new AppError('Categoty does not exist with given Id', 404));
  }

  req.categoryData = category;

  next();
});

module.exports = { categoryExists };
