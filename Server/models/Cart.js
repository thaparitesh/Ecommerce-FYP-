const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Product = require("./Product");

const Cart = sequelize.define("Cart", {
  cartID: {  
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userID: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: User,
      key: "userID",  
    },
    onDelete: "CASCADE",
  },
}, {
  timestamps: true,
  tableName: "carts" 
});

const CartItem = sequelize.define("CartItem", {
  cartItemID: { 
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cartID: {
    type: DataTypes.INTEGER,  
    allowNull: false,
    references: {
      model: Cart,
      key: "cartID", 
    },
    onDelete: "CASCADE",
  },
  productID: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: Product,
      key: "productID",  
    },
    onDelete: "CASCADE",
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
}, {
  timestamps: true,
  tableName: "cart_items" 
});

// Associations
Cart.hasMany(CartItem, { 
  foreignKey: "cartID", 
  as: "items",
  onDelete: "CASCADE" 
});

CartItem.belongsTo(Cart, { 
  foreignKey: "cartID",
  as: "cart" 
});

CartItem.belongsTo(Product, { 
  foreignKey: "productID",
  as: "product" 
});

module.exports = { Cart, CartItem };