const express = require('express');

//Controller
const {
  getAllCategory,
  createCategory,
  updateCategory,
  deletedCategory,
  getCategoryById,
} = require('../controllers/categoryController');

//Middlewares
const {
  protectAdmin,
  protectToken,
} = require('../middlewares/usersMiddlewares');

const {
  createCategoryValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');

const { categoryExists } = require('../middlewares/categoryMiddlewares');

const router = express.Router();

router.get('/', getAllCategory);

router.use(protectToken, protectAdmin);

router.post('/', createCategoryValidations, checkValidations, createCategory);

router
  .route('/:categoryId')
  .get(categoryExists, getCategoryById)
  .patch(categoryExists, updateCategory)
  .delete(categoryExists, deletedCategory);

module.exports = { categoryRoutes: router };
