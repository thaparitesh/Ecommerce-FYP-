const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vendor = sequelize.define("Vendor", {
  vendorID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  panIDImage: {  
    type: DataTypes.STRING,
    allowNull: false, 
  },
  NIDImage: {  
    type: DataTypes.STRING,
    allowNull: true, 
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
}, {
  timestamps: true,
});

module.exports = Vendor;