const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Cart = require("./Cart");
const Address = require("./Address");
const Product = require("./Product");
const { v4: uuidv4 } = require('uuid');
const Vendor = require("./Vendor");


const Order = sequelize.define("Order", {
  orderID: {
    type: DataTypes.UUID, // Changed from INTEGER to UUID
    defaultValue: () => uuidv4(), // Generate a new UUID by default
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
  cartID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cart,
      key: "cartID",
    },
    onDelete: "CASCADE",
  },
  addressID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Address,
      key: "addressID",
    },
  },
  orderStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  orderUpdateDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: "orders",
});

const OrderItem = sequelize.define("OrderItem", {
  orderItemID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderID: {
    type: DataTypes.UUID, // Changed to match the Order model's ID type
    allowNull: false,
    references: {
      model: Order,
      key: "orderID",
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
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  vendorID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vendor, 
      key: "vendorID",
    }
  },
  orderDetailStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
}, {
  timestamps: false,
  tableName: "order_items",
});

module.exports = { Order, OrderItem };