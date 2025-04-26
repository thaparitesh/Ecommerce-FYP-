const User = require("./User");
const Product = require("./Product");
const Cart = require("./Cart").Cart;
const CartItem = require("./Cart").CartItem;
const Address = require("./Address");
const { Order, OrderItem } = require("./Order");
const Vendor = require("./Vendor");

// Define all associations here
Order.belongsTo(User, { foreignKey: "userID", as: "user" });
Order.belongsTo(Cart, { foreignKey: "cartID", as: "cart" });
Order.belongsTo(Address, { foreignKey: "addressID", as: "address" });

Order.hasMany(OrderItem, { foreignKey: "orderID", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderID", as: "order" });
OrderItem.belongsTo(Product, { foreignKey: "productID", as: "product" });
OrderItem.belongsTo(Vendor, { foreignKey: 'vendorID' , as: "vendor"});
Vendor.hasMany(OrderItem, { foreignKey: 'vendorID' });

module.exports = {
  Order,
  OrderItem
};