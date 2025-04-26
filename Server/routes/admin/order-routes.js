const express = require("express");
const router = express.Router();
const {
 getAllOrdersFromAllUsers,
 getOrderDetailsAdmin,
 updateOrderStatus,
 getAdminSalesReports
} = require("../../controllers/admin/order-controller");

// Get all orders of all  user
router.get("/get", getAllOrdersFromAllUsers);
router.get("/details/:id", getOrderDetailsAdmin);
router.put("/update/:id", updateOrderStatus);
// router.put("/payment/update/:id", updatePaymentStatus);
router.get("/get/sales-reports", getAdminSalesReports);



module.exports = router;