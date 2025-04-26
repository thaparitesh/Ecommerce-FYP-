const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Feature = sequelize.define("Feature", {
  featureID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true, 
});

module.exports = Feature;