const { Order, OrderItem } = require("../../models/OrderAssociations");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");
const User = require("../../models/User"); 
const sequelize = require("../../config/database"); 

const addProductReview = async (req, res) => {
  try {
    const { productID, userID, userName, reviewMessage, reviewValue } = req.body;
    
    // Check if user has purchased the product
    const order = await Order.findOne({
      where: {
        userID: userID,
        orderStatus: 'delivered'
      },
      include: [{
        model: OrderItem,
        as: 'items', // <-- Add the alias here
        where: { productID: productID },
        required: true
      }]
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase the product to review it.",
      });
    }

    // Rest of the code remains the same...
    const checkExistingReview = await ProductReview.findOne({
      where: {
        productID: productID,
        userID: userID
      }
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    // Create new review
    const newReview = await ProductReview.create({
      productID,
      userID,
      userName,
      reviewMessage,
      reviewValue,
    });

    // Calculate new average review
    const reviews = await ProductReview.findAll({
      where: { productID },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('reviewValue')), 'averageRating']
      ],
      raw: true
    });

    const averageReview = parseFloat(reviews[0].averageRating) || 0;

    // Update product's average review
    await Product.update(
      { averageReview: averageReview },
      { where: { productID: productID } }
    );

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productID } = req.params;

    const reviews = await ProductReview.findAll({
      where: { productID },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['userName', 'email'] 
        }
      ],
      order: [['createdAt', 'DESC']] // Added sorting by date
    });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};


const getUnreviewedProducts = async (req, res) => {
  try {
    const { userID } = req.params;

    // Get all delivered orders for the user
    const deliveredOrders = await Order.findAll({
      where: {
        userID: userID,
        orderStatus: 'delivered'
      },
      include: [{
        model: OrderItem,
        as: 'items',
        required: true
      }]
    });

    // Get all product IDs the user has reviewed
    const reviewedProducts = await ProductReview.findAll({
      where: { userID },
      attributes: ['productID'],
      raw: true
    });
    const reviewedProductIds = reviewedProducts.map(r => r.productID);

    // Filter out products that have been reviewed
    const unreviewedProducts = [];
    deliveredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!reviewedProductIds.includes(item.productID)) {
          // Check if product is already in the array
          const exists = unreviewedProducts.some(
            p => p.productID === item.productID
          );
          if (!exists) {
            unreviewedProducts.push({
              productID: item.productID,
              title: item.title,
              image: item.image,
              orderID: order.orderID,
              orderDate: order.orderDate
            });
          }
        }
      });
    });

    res.status(200).json({
      success: true,
      data: unreviewedProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews, getUnreviewedProducts };