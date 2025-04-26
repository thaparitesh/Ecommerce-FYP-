const express = require('express');
const { registerVendor, loginVendor, logoutVendor, vendorAuthCheck, changeVendorPassword } = require('../../controllers/vendor/vendorAuthController');


const router = express.Router();

router.post('/register', registerVendor)
router.post('/login', loginVendor)
router.post('/logout', logoutVendor)
router.get('/check-auth', vendorAuthCheck)
router.post('/update/:vendorID/change-password', changeVendorPassword);


module.exports = router;