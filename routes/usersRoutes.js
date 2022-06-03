const express = require('express');

// Middlewares
const {
  userExists,
  protectToken,
  protectAccountOwner,
  protectAdmin,
} = require('../middlewares/usersMiddlewares');
const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');

// Controller
const {
  getAllUsers,
  createUser,
  login,
  getAllProductUser,
  updateUser,
  deleteUser,
  getAllOrderUser,
  getOrderUserById,
} = require('../controllers/usersController');

const router = express.Router();

router.post('/', createUserValidations, checkValidations, createUser);

router.post('/login', login);

// Apply protectToken middleware
router.use(protectToken);

router.get('/', protectAdmin, getAllUsers);

router.get('/me', getAllProductUser);

router.get('/orders', getAllOrderUser);

router.get('/orders/:orderId', getOrderUserById);

router
  .route('/:id')
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
