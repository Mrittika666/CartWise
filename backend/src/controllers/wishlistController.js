const Wishlist = require("../models/wishlistModel");

// Add product to wishlist
const addWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!Number.isInteger(Number(productId)) || Number(productId) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid product ID is required",
            });
        }

        const wishlist = await Wishlist.addToWishlist(
            req.user.id,
            Number(productId)
        );

        res.status(201).json({
            success: true,
            message: "Product added to wishlist successfully",
            wishlist,
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Product is already in your wishlist",
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

// Get wishlist
const getMyWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.getWishlist(req.user.id);

        res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Remove product from wishlist
const removeWishlist = async (req, res) => {
    try {
        const productId = Number(req.params.productId);

        if (!Number.isInteger(productId) || productId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const removed = await Wishlist.removeFromWishlist(
            req.user.id,
            productId
        );

        if (!removed) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    addWishlist,
    getMyWishlist,
    removeWishlist,
};