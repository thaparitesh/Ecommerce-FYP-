const express = require('express')
const { addAddress, fetchAllAddress, editAddress, deleteAddress } = require('../../controllers/shop/address-controller')

const router = express.Router();

router.post('/add',addAddress)
router.get('/get/:userID',fetchAllAddress)
router.put('/update/:userID/:addressID', editAddress)
router.delete('/delete/:userID/:addressID', deleteAddress)

module.exports = router