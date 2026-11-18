
const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    removeFromCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// All cart routes require login
router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:productId", protect, removeFromCart);

module.exports = router;
