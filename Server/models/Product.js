const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Vendor = require("./Vendor");


const Product = sequelize.define("Product", {
  productID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  salePrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  totalStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  averageReview: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  vendorID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Vendors', 
      key: 'vendorID'
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
  },
}, {
  timestamps: true, 
});
Product.belongsTo(Vendor, { foreignKey: 'vendorID' });
Vendor.hasMany(Product, { foreignKey: 'vendorID' });



module.exports = Product;
