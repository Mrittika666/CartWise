const express = require("express");
const router = express.Router();

const {
    addWishlist,
    getMyWishlist,
    removeWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

// All wishlist routes require login
router.post("/", protect, addWishlist);
router.get("/", protect, getMyWishlist);
router.delete("/:productId", protect, removeWishlist);

module.exports = router;