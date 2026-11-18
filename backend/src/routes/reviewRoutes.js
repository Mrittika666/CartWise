const express = require("express");
const router = express.Router();

const {
    addReview,
    getReviews,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// Add review (logged-in users only)
router.post("/", protect, addReview);

// Get reviews for a product (public)
router.get("/:productId", getReviews);

module.exports = router;