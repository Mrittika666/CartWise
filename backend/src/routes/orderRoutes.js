
const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelMyOrder,
    getOrderTracking,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Admin routes
router.get("/admin/all", protect, admin, getAllOrders);
router.put("/admin/:id/status", protect, admin, updateOrderStatus);

// User routes
router.post("/", protect, placeOrder);
router.get("/", protect, getMyOrders);

// Tracking route (keep before /:id)
router.get("/:id/tracking", protect, getOrderTracking);

// Order details and cancellation
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelMyOrder);

module.exports = router;
