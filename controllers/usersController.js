const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/userModel');
const { Order } = require('../models/orderModel');
const { Product } = require('../models/productModel');
const { Cart } = require('../models/cartMolde');
const { ProductsInCart } = require('../models/productsInCartModel');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });

  res.status(200).json({
    users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { userName, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    userName,
    email,
    password: hashPassword,
    role,
  });

  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({ newUser });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const getAllProductUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const userProduct = await Product.findAll({
    where: { userId: sessionUser.id },
  });

  res.status(200).json({ userProduct });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { userData } = req;
  const { userName, email } = req.body;

  await userData.update({ userName, email });

  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { userData } = req;

  await userData.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

const getAllOrderUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orderUser = await Order.findAll({
    where: { userId: sessionUser.id },
    include: [
      {
        model: Cart,
        attributes: ['id'],
        include: [
          {
            model: ProductsInCart,
            attributes: ['id', 'quantity'],
            include: [{ model: Product, attributes: ['price', 'title'] }],
          },
        ],
      },
    ],
  });

  res.status(200).json({ orderUser });
});

const getOrderUserById = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { orderId } = req.params;

  const orderUserById = await Order.findOne({
    where: { userId: sessionUser.id, id: orderId },
    include: [
      {
        model: Cart,
        attributes: ['id'],
        include: [
          {
            model: ProductsInCart,
            attributes: ['id', 'quantity'],
            include: [{ model: Product, attributes: ['price', 'title'] }],
          },
        ],
      },
    ],
  });

  res.status(200).json({ orderUserById });
});

module.exports = {
  getAllUsers,
  createUser,
  login,
  getAllProductUser,
  updateUser,
  deleteUser,
  getAllOrderUser,
  getOrderUserById,
};
