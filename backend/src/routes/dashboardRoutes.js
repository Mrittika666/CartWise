const express = require("express");
const router = express.Router();

const {
    getDashboardStats,
    getRecentOrders,
    getSalesAnalytics,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Admin-only dashboard routes
router.get("/stats", protect, admin, getDashboardStats);
router.get("/recent-orders", protect, admin, getRecentOrders);
router.get("/sales-analytics", protect, admin, getSalesAnalytics);

module.exports = router;