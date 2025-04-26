const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
require("dotenv").config();


// Register User
const registerUser = async (req, res) => {
  const { userName, email, phoneNumber, password, address } = req.body;

  try {
    const checkUser = await User.findOne({ where: { email } });
    if (checkUser)
      return res.json({
        success: false,
        message: "User already exists with this email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      userName,
      email,
      phoneNumber,
      password: hashPassword,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: newUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ where: { email } });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });
   

    const token = jwt.sign(
      {
        id: checkUser.userID, 
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
        phoneNumber: checkUser.phoneNumber,
      },
      process.env.CLIENT_SECRET_KEY, 
      { expiresIn: "2h" }
    );
  
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser.userID,
        userName: checkUser.userName,
        phoneNumber: checkUser.phoneNumber,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};


// Logout User
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

const authCheck = async (req, res) => {
  const token = req.cookies.token; 

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized"
     });
  }

  try {
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY, );
    
    const user = await User.findOne({ where: { userID: decoded.id } });

    if (!user) {
      return res.status(401).json({
         success: false, 
         message: "User not found"
         });
    }

    res.json({
      success: true,
      message: "Authenticated User",
      user: {
        id: user.userID,
        email: user.email,
        role: user.role,
        userName: user.userName,
        phoneNumber : user.phoneNumber,
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
// Add these to your existing auth controller file

const updateProfile = async (req, res) => {
  const { userID } = req.params;
  const { userName, phoneNumber } = req.body;

  try {
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update only allowed fields
    const [updatedRows] = await User.update(
      { userName, phoneNumber },
      { where: { userID: userID } }
    );

    if (updatedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes made or user not found"
      });
    }

    // Fetch updated user data
    const updatedUser = await User.findByPk(userID);
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.userID,
        email: updatedUser.email,
        userName: updatedUser.userName,
        phoneNumber: updatedUser.phoneNumber,
        // role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};
const changePassword = async (req, res) => {
  const { userID } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const [updatedRows] = await User.update(
      { password: hashedPassword },
      { where: { userID: userID } }
    );

    if (updatedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to update password"
      });
    }

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only admins can access this resource"
      });
    }
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, 
      order: [['createdAt', 'DESC']] 
    });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};
module.exports = { registerUser, loginUser, logoutUser, authCheck,updateProfile, changePassword, getAllUsers };
