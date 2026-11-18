
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const addressRoutes = require("./routes/addressRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CartWise Backend is running!",
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("PostgreSQL Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`CartWise Backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database Connection Failed:", error.message);
        process.exit(1);
    }
};

startServer();
