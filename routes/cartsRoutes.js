const express = require('express');

//Controller
const {
  getUserCart,
  addProductCart,
  updateProductCart,
  deletedProductCart,
  purchaseProductInCart,
} = require('../controllers/cartController');

//Middlewares

const { protectToken } = require('../middlewares/usersMiddlewares');

const router = express.Router();

//Endponints
router.use(protectToken);

router.get('/', getUserCart);

router.post('/add-product', addProductCart);

router.patch('/update-cart', updateProductCart);

router.post('/purchase', purchaseProductInCart);

router.delete('/:productInCartId', deletedProductCart);

module.exports = { cartsRoutes: router };
