const express = require('express');
const { addProductReview, getProductReviews, getProductReviewByUser, getUnreviewedProducts } = require('../../controllers/shop/product-review-controller');

const router = express.Router();

router.post('/add', addProductReview)
router.get('/:productID', getProductReviews)
router.get('/unreviewed/:userID', getUnreviewedProducts)


module.exports = router;
