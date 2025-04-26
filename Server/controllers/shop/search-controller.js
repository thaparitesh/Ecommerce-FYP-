
const { Op } = require('sequelize');
const Product = require('../../models/Product');

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const searchResults = await Product.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${keyword}%` } },
          { description: { [Op.iLike]: `%${keyword}%` } },
          { category: { [Op.iLike]: `%${keyword}%` } },
          { brand: { [Op.iLike]: `%${keyword}%` } }
        ]
      }
    });

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error searching products",
      error: error.message
    });
  }
};

module.exports = { searchProducts };