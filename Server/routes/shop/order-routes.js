const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyEsewaPayment,
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/shop/order-controller");

router.post("/create", createOrder);
router.get("/verify-esewa", verifyEsewaPayment);
router.get("/list/:userID", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;