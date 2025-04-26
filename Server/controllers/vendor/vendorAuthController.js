const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../../models/Vendor");
require("dotenv").config();

// Register Vendor (With mandatory PAN ID)
const registerVendor = async (req, res) => {
  const { ownerName, businessName, email, phone, address, password, panIDImage, NIDImage } = req.body;

  // Validate PAN ID exists
  if (!panIDImage) {
    return res.status(400).json({
      success: false,
      message: "Image of PAN ID Card is required for vendor registration",
    });
  }
  if (!NIDImage) {
    return res.status(400).json({
      success: false,
      message: "Image of NID is required for vendor registration",
    });
  }

  try {
    const checkVendor = await Vendor.findOne({ where: { email } });
    if (checkVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor already exists with this email!",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newVendor = await Vendor.create({
      ownerName,
      businessName,
      email,
      phone,
      address,
      password: hashPassword,
      panIDImage, 
      NIDImage,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: "Vendor registration submitted for verification",
      vendor: {
        id: newVendor.vendorID,
        businessName: newVendor.businessName,
        status: newVendor.status
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Vendor registration failed",
      error: e.message,
    });
  }
};
// Login Vendor
const loginVendor = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const vendor = await Vendor.findOne({ where: { email } });
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found!",
        });
      }
  
      // Check if vendor is approved
      if (vendor.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: "Your account is not yet approved or is suspended",
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, vendor.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials!",
        });
      }
  
      const token = jwt.sign(
        {
          id: vendor.vendorID,
          role: 'vendor',
          email: vendor.email,
          businessName: vendor.businessName,
          phone: vendor.phone,
          address: vendor.address,

        },
        process.env.VENDOR_SECRET_KEY || process.env.CLIENT_SECRET_KEY,
        { expiresIn: "2h" } 
      );
  
      res.cookie("vendorToken", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' 
      }).json({
        success: true,
        message: "Vendor login successful",
        vendor: {
          id: vendor.vendorID,
          businessName: vendor.businessName,
          email: vendor.email,
          ownerName: vendor.ownerName,
          phone: vendor.phone,
          address: vendor.address,
        },
        token
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: e.message,
      });
    }
  };
  
  // Vendor Auth Check
  const vendorAuthCheck = async (req, res) => {
    const token = req.cookies.vendorToken;
  
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No vendor session found" 
      });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.VENDOR_SECRET_KEY || process.env.CLIENT_SECRET_KEY);
      const vendor = await Vendor.findByPk(decoded.id);
  
      if (!vendor || vendor.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: "Vendor account not active",
        });
      }
  
      res.json({
        success: true,
        message: "Authenticated Vendor",
        vendor: {
          id: vendor.vendorID,
          businessName: vendor.businessName,
          email: vendor.email,
          ownerName: vendor.ownerName,
          status: vendor.status,
          phone: vendor.phone,
          address: vendor.address,
        },
      });
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid vendor token" 
      });
    }
  };
  
  // Logout Vendor
  const logoutVendor = (req, res) => {
    res.clearCookie("vendorToken").json({
      success: true,
      message: "Vendor logged out successfully",
    });
  };
  
  // Change Vendor Password
const changeVendorPassword = async (req, res) => {
    const { vendorID } = req.params;
    const { currentPassword, newPassword } = req.body;
  
    try {
      const vendor = await Vendor.findByPk(vendorID);
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, vendor.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await Vendor.update(
        { password: hashedPassword },
        { where: { vendorID } }
      );
  
      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Password change failed",
        error: error.message,
      });
    }
  };
  
  module.exports = {
    registerVendor,
    loginVendor,
    logoutVendor,
    vendorAuthCheck,
    changeVendorPassword,
  };