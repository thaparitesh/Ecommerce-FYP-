const Vendor = require("../../models/Vendor");

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
      error: error.message
    });
  }
};

const getVendorDetails = async (req, res) => {
  try {
    const { vendorID } = req.params;
    const vendor = await Vendor.findByPk(vendorID, {
      attributes: { exclude: ['password'] }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor details",
      error: error.message
    });
  }
};

const updateVendorStatus = async (req, res) => {
  const { vendorID } = req.params;
  const { status } = req.body;

  // Validate status input
  const validStatuses = ['pending', 'active', 'suspended', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value"
    });
  }

  try {
    const vendor = await Vendor.findByPk(vendorID);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    // Prevent changing from rejected back to pending
    if (vendor.status === 'rejected' && status === 'pending') {
      return res.status(400).json({
        success: false,
        message: "Rejected vendors cannot be set back to pending"
      });
    }

    await vendor.update({ status });

    res.json({
      success: true,
      message: `Vendor status updated to ${status}`,
      data: {
        id: vendor.vendorID,
        businessName: vendor.businessName,
        email: vendor.email,
        status: vendor.status,
        updatedAt: vendor.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update vendor status",
      error: error.message
    });
  }
};

const getPendingVendors = async (req, res) => {
  try {
    const pendingVendors = await Vendor.findAll({
      where: { status: 'pending' },
      attributes: ['vendorID', 'businessName', 'ownerName', 'email', 'createdAt'],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: pendingVendors,
      count: pendingVendors.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending vendors",
      error: error.message
    });
  }
};

module.exports = {
  getAllVendors,
  getVendorDetails,
  updateVendorStatus,
  getPendingVendors
};