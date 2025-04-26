const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const ProductReview = sequelize.define("ProductReview", {
  reviewID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products', 
      key: 'productID'
    }
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', 
      key: 'userID'
    }
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewMessage: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
  reviewValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5 
    }
  },
}, {
  timestamps: true, 
  tableName: 'product_reviews' 
});
ProductReview.belongsTo(User, { foreignKey: 'userID', as: 'user' });

module.exports = ProductReview;