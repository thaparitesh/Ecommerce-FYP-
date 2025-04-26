const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    const { userID, address, city, phoneNumber, notes } = req.body;

    if (!userID || !address || !city || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const newlyCreatedAddress = await Address.create({
      userID,
      address,
      city,
      phoneNumber,
      notes,
    });

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error adding address",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID) {
      return res.status(400).json({
        success: false,
        message: "User ID is required!",
      });
    }

    const addressList = await Address.findAll({ where: { userID } });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
    });
  }
};

// Edit Address
const editAddress = async (req, res) => {
  try {
    const { userID, addressID } = req.params;
    const formData = req.body;

    if (!userID || !addressID) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required!",
      });
    }

    const [updated] = await Address.update(formData, {
      where: { addressID, userID },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Address not found or no changes made",
      });
    }

    const updatedAddress = await Address.findOne({ where: { addressID } });

    res.status(200).json({
      success: true,
      data: updatedAddress,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error updating address",
    });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    const { userID, addressID } = req.params;

    if (!userID || !addressID) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required!",
      });
    }

    const deleted = await Address.destroy({ where: { addressID, userID } });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error deleting address",
    });
  }
};

module.exports = { addAddress, fetchAllAddress, editAddress, deleteAddress };
