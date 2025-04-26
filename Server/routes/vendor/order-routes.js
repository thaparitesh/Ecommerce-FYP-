const express = require("express");
const { getAllOrdersFromAllUsersForVendor, getOrderDetailsVendor, updateOrderStatus, getSalesReports } = require("../../controllers/vendor/order-controller");
const router = express.Router();


router.get("/get/:vendorID", getAllOrdersFromAllUsersForVendor);
router.get("/details/:id/:vendorID", getOrderDetailsVendor);
router.put("/update/:id/:vendorID", updateOrderStatus);
router.get("/sales-reports/:vendorID", getSalesReports);


module.exports = router;