const Review = require("../models/reviewModel");

// Add product review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Product ID and rating are required",
            });
        }

        if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        const review = await Review.createReview(
            req.user.id,
            productId,
            rating,
            comment || null
        );

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review,
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this product",
            });
        }

        if (error.code === "23503") {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get product reviews
const getReviews = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);

        if (!Number.isInteger(productId) || productId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const reviews = await Review.getProductReviews(productId);
        const rating = await Review.getProductRating(productId);

        res.status(200).json({
            success: true,
            count: reviews.length,
            rating,
            reviews,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    addReview,
    getReviews,
};