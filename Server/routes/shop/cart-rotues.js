const express = require('express');
const { addToCart, fetchCartItems, deleteCartItem, updateCartItemQty } = require('../../controllers/shop/cart-controller');

const router = express.Router();

router.post('/add-cart', addToCart);
router.get('/get/:userID', fetchCartItems);
router.put('/update-cart', updateCartItemQty);
router.delete('/:userID/:productID', deleteCartItem);

module.exports = router;
