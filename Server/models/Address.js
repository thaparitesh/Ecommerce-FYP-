const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User"); // Import User model for foreign key reference

const Address = sequelize.define(
  "Address",
  {
    addressID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // References User table
        key: "userID",
      },
      onDelete: "CASCADE", // Deletes addresses if user is deleted
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20), 
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
    tableName: "Addresses",
  }
);

module.exports = Address;
