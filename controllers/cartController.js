//Models
const { Cart } = require('../models/cartMolde');
const { ProductsInCart } = require('../models/productsInCartModel');
const { Product } = require('../models/productModel');
const { Category } = require('../models/categoryModel');
const { Order } = require('../models/orderModel');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const getUserCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cartUser = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
    include: [
      {
        model: ProductsInCart,
        attributes: ['id', 'quantity', 'status'],
        include: [
          {
            model: Product,
            attributes: ['title', 'price', 'description'],
            include: [{ model: Category, attributes: ['name'] }],
          },
        ],
      },
    ],
  });

  res.status(200).json({ cartUser });
});

const addProductCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { sessionUser } = req;

  let appProduct = null;

  const productInventory = await Product.findOne({
    where: { id: productId, status: 'active' },
  });

  //console.log(productInventory);

  if (!productInventory) {
    return next(new AppError('Invalid product', 404));
  } else if (productInventory.quantity < quantity || quantity < 0) {
    return next(
      new AppError(
        `This product only has ${productInventory.quantity} items available`,
        400
      )
    );
  }

  const cartData = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
  });

  if (!cartData) {
    const newCart = await Cart.create({ userId: sessionUser.id });

    const newAddProduct = await ProductsInCart.create({
      cartId: newCart.id,
      productId,
      quantity,
    });
    appProduct = newAddProduct;
  } else {
    const productInCartExist = await ProductsInCart.findOne({
      where: {
        cartId: cartData.id,
        productId,
      },
    });

    //console.log(productInCartExist);

    if (productInCartExist && productInCartExist.status === 'active') {
      return next(
        new AppError(`You already have the product in your cart`, 404)
      );
    } else if (productInCartExist && productInCartExist.status === 'removed') {
      const updateProduct = await productInCartExist.update({
        status: 'active',
        quantity,
      });
      appProduct = updateProduct;
    } else if (!productInCartExist) {
      const newProduct = await ProductsInCart.create({
        cartId: cartData.id,
        productId,
        quantity,
      });
      appProduct = newProduct;
    }
  }

  res.status(201).json({ status: 'success', appProduct });
});

const updateProductCart = catchAsync(async (req, res, next) => {
  const { newQty, productId } = req.body;
  const { sessionUser } = req;

  let updateProduct = null;

  const cartData = await Cart.findOne({
    where: { id: sessionUser.id, status: 'active' },
  });

  if (!cartData) {
    return next(new AppError('Must create a cart first', 400));
  }

  const productInCartExtis = await ProductsInCart.findOne({
    where: { cartId: cartData.id, productId },
    include: [{ model: Product }],
  });

  //console.log(productInCartExtis);

  if (!productInCartExtis) {
    return next(new AppError('This product does not exist in your cart', 404));
  }

  if (
    productInCartExtis &&
    (newQty < 0 || newQty > productInCartExtis.product.quantity)
  ) {
    return next(
      new AppError(
        `Invalid selected quantity, this product only has ${productInCartExtis.product.quantity} items available`,
        400
      )
    );
  }

  if (productInCartExtis && newQty === 0) {
    const updateStatus = await productInCartExtis.update({
      status: 'removed',
      quantity: newQty,
    });
    updateProduct = updateStatus;
  } else if (productInCartExtis && newQty > 0) {
    const productUpdate = await productInCartExtis.update({
      quantity: newQty,
      status: 'active',
    });
    updateProduct = productUpdate;
  }

  res.status(200).json({ status: 'success', updateProduct });
});

const purchaseProductInCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  let totalPrice = 0;

  const cartData = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
    include: [
      {
        model: ProductsInCart,
        status: 'active',
        include: [{ model: Product }],
      },
    ],
  });

  if (!cartData) {
    return next(new AppError('This user does not have a cart yet.', 400));
  }

  const cartPromises = cartData.productsInCarts.map(async e => {
    const updateQuantity = e.product.quantity - e.quantity;

    const quantiyInv = e.product.quantity;
    console.log(e.product.quantity, e.quantity, updateQuantity, quantiyInv);

    //NO ACTUALIZA msg "quantiyInv.update is not a function"
    //await quantiyInv.update({ quantity: updateQuantity });

    const productPrice = e.quantity * parseInt(e.product.price);
    totalPrice += productPrice;
    //console.log(productPrice, e.quantity, e.product.price);

    return await e.update({ status: 'purchase' });
  });

  await Promise.all(cartPromises);

  const newOrder = await Order.create({
    userId: sessionUser.id,
    cartId: cartData.id,
    totalPrice,
  });

  await cartData.update({ status: 'purchased' });

  res.status(201).json({ status: 'success', newOrder });
});

const deletedProductCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productInCartId } = req.params;

  const cartData = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
  });

  if (!cartData) {
    return next(new AppError('Cart no Exits', 400));
  }

  const productInCart = await ProductsInCart.findOne({
    where: {
      cartId: cartData.id,
      productId: productInCartId,
      status: 'active',
    },
  });

  if (!productInCart) {
    return next(new AppError('The product does not exist in the cart', 400));
  }

  await productInCart.update({ quantity: 0, status: 'removed' });

  res.status(200).json({ status: 'success', cartData });
});

module.exports = {
  getUserCart,
  addProductCart,
  updateProductCart,
  deletedProductCart,
  purchaseProductInCart,
};
