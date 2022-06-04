const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError');

const createUserValidations = [
  body('userName').notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const createProductValidations = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('description')
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 100 })
    .withMessage('comments must be maximum 100 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price cannot be empty')
    .isFloat({ min: 0 })
    .withMessage('Invalide value'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity cannot be empty')
    .isInt({ min: 0 })
    .withMessage('Quantity must be integer'),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    // [msg, msg, msg] -> 'msg. msg. msg'
    const errorMsg = messages.join('. ');

    return next(new AppError(errorMsg, 400));
  }

  next();
};

module.exports = {
  createUserValidations,
  createProductValidations,
  createCategoryValidations,
  checkValidations,
};
