const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth/auth-route");
const sequelize = require("./config/database");

const adminProductRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminApproveVenodorRouter = require("./routes/admin/approveVendor-routes");

const shopProductRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-rotues");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const searchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

const vendorAuthRouter = require("./routes/vendor/vendorAuth-routes");
const vendorProductRouter = require("./routes/vendor/products-routes");
const vendorOrderRouter = require("./routes/vendor/order-routes");


const app = express();
const PORT = process.env.PORT;

// Enable CORS before routes
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], 
    methods: ["POST", "GET", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRouter)
app.use("/api/admin/orders", adminOrderRouter)
app.use('/api/admin/approve', adminApproveVenodorRouter)

app.use("/api/shop/products", shopProductRouter)
app.use("/api/shop/cart", shopCartRouter)
app.use('/api/shop/address', shopAddressRouter)
app.use('/api/shop/order', shopOrderRouter)
app.use('/api/shop/search', searchRouter)
app.use('/api/shop/review', shopReviewRouter)

app.use('/api/common/feature', commonFeatureRouter)

app.use('/api/vendorAuth', vendorAuthRouter)
app.use("/api/vendor/products", vendorProductRouter)
app.use("/api/vendor/orders", vendorOrderRouter)




// Sync database & start server
sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.error("Database connection failed:", err));

