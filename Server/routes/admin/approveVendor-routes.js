const express = require("express");
const router = express.Router();

const { getAllVendors,
    getVendorDetails,
    updateVendorStatus,
    getPendingVendors } = require("../../controllers/admin/vendor-approval-controller");

// Get all orders of all  user
router.get("/get", getAllVendors);
router.get("/details/:vendorID", getVendorDetails);
router.get("/pending", getPendingVendors);
router.put("/update/:vendorID", updateVendorStatus);

module.exports = router;