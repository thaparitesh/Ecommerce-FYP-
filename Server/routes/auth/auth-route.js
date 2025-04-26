const express = require('express');
const { registerUser, loginUser, logoutUser, authCheck, updateProfile, changePassword, getAllUsers } = require('../../controllers/auth/auth-controller');


const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/check-auth', authCheck)
router.put('/users/:userID', updateProfile);
router.post('/users/:userID/change-password', changePassword);
router.get('/allusers', getAllUsers)


module.exports = router;