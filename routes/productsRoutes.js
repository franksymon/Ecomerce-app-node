const express = require('express');

//Controllers
const {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deletedProduct,
} = require('../controllers/productsController');

//Middlewares
const { productExists } = require('../middlewares/productsMiddlewares');
const {
  protectToken,
  userExists,
  protectAccountOwner,
} = require('../middlewares/usersMiddlewares');
const {
  createProductValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');

const router = express.Router();

router.get('/', getAllProduct);

router.get('/:productId', getProductById);

router.use(protectToken);

router.post('/', createProductValidations, checkValidations, createProduct);

router
  .route('/:productId')
  .patch(userExists, protectAccountOwner, productExists, updateProduct)
  .delete(userExists, protectAccountOwner, productExists, deletedProduct);

module.exports = { productsRoutes: router };
