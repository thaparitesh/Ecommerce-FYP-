const { Cart, CartItem } = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
    try {
      const { userID, productID, quantity } = req.body;
  
      if (!userID || !productID || quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid data!" });
      }
  
      // Check if product exists
      const product = await Product.findByPk(productID);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found!" });
      }
  
      // Find or create cart
      const [cart] = await Cart.findOrCreate({
        where: { userID },
        defaults: { userID },
      });
  
      // Find or update cart item
      const [cartItem, created] = await CartItem.findOrCreate({
        where: { cartID: cart.cartID, productID },  
        defaults: { quantity },
      });
  
      if (!created) {
        cartItem.quantity += quantity;
        await cartItem.save();
      }
  
      res.status(200).json({ success: true, data: cartItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
};
const fetchCartItems = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID) {
      return res.status(400).json({ success: false, message: "User ID required!" });
    }

    const cart = await Cart.findOne({
      where: { userID },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product"
            }
          ],
          order: [["createdAt", "ASC"]],  
        }
      ],
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const formattedItems = cart.items.map((item) => ({
      cartItemID: item.cartItemID,
      productID: item.product.productID,
      image: item.product.image,
      title: item.product.title,
      price: item.product.price,
      salePrice: item.product.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        cartID: cart.cartID,
        userID: cart.userID,
        items: formattedItems,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userID, productID, quantity } = req.body; // Using correct casing

    if (!userID || !productID || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({
      where: { userID }, 
      include: {
        model: CartItem,
        as: "items",
      },
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Find the specific CartItem
    const cartItem = await CartItem.findOne({
      where: {
        cartID: cart.cartID,
        productID, 
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found!",
      });
    }

    // Update the quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedCart = await Cart.findOne({
      where: { userID },
      include: [
        {
          model: CartItem,
          as: "items",
          include: {
            model: Product,
            as: "product",
            attributes: ["productID", "image", "title", "price", "salePrice"],
          },
        },
      ],
      order: [["items", "createdAt", "ASC"]], 
    });
    

    // Format response
    const populatedCartItems = updatedCart.items.map((item) => ({
      productID: item.product ? item.product.productID : null,
      image: item.product ? item.product.image : null,
      title: item.product ? item.product.title : "Product not found",
      price: item.product ? item.product.price : null,
      salePrice: item.product ? item.product.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        cartID: updatedCart.cartID,
        userID: updatedCart.userID,
        items: populatedCartItems,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const deleteCartItem = async (req, res) => {
  try {
    const { userID, productID } = req.params; 

    if (!userID || !productID) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({
      where: { userID }, 
      include: {
        model: CartItem,
        as: "items",
        include: {
          model: Product,
          as: "product",
          attributes: ["productID", "image", "title", "price", "salePrice"],
        },
      },
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Delete the cart item
    const deletedCount = await CartItem.destroy({
      where: {
        cartID: cart.cartID,
        productID, 
      },
    });

    if (!deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found!",
      });
    }

    // Fetch updated cart
    const updatedCart = await Cart.findOne({
      where: { userID }, 
      include: {
        model: CartItem,
        as: "items",
        include: {
          model: Product,
          as: "product",
          attributes: ["productID", "image", "title", "price", "salePrice"],
        },
      },
    });

    // Format response
    const populatedCartItems = updatedCart.items.map((item) => ({
      productID: item.product ? item.product.productID : null, 
      image: item.product ? item.product.image : null,
      title: item.product ? item.product.title : "Product not found",
      price: item.product ? item.product.price : null,
      salePrice: item.product ? item.product.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        cartID: updatedCart.cartID,
        userID: updatedCart.userID, 
        items: populatedCartItems,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





module.exports = { addToCart, fetchCartItems, updateCartItemQty, deleteCartItem };