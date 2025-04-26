const { Op } = require("sequelize");
const Product = require("../../models/Product");



const getFilteredProducts = async (req, res) => {
  try {
    let { category, brand, sortBy = "price-lowtohigh" } = req.query;
    let filters = {};

    // Normalize category into an array
    if (category) {
      const categoryArray = Array.isArray(category) ? category : category.split(",");
      filters.category = { [Op.in]: categoryArray.map((c) => c.trim()) };
    }

    // Normalize brand into an array
    if (brand) {
      const brandArray = Array.isArray(brand) ? brand : brand.split(",");
      filters.brand = { [Op.in]: brandArray.map((b) => b.trim()) };
    }

    // Sorting logic
    let order = [];
    switch (sortBy) {
      case "price-lowtohigh":
        order.push(["price", "ASC"]);
        break;
      case "price-hightolow":
        order.push(["price", "DESC"]);
        break;
      case "title-atoz":
        order.push(["title", "ASC"]);
        break;
      case "title-ztoa":
        order.push(["title", "DESC"]);
        break;
      default:
        order.push(["price", "ASC"]);
        break;
    }

    // Fetch products from the database
    const products = await Product.findAll({
      where: filters,
      order: order,
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching products.",
    });
  }
};




const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
