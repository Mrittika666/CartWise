
const Cart = require("../models/cartModel");

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid product ID and quantity are required",
            });
        }

        const cartItem = await Cart.addToCart(
            req.user.id,
            productId,
            quantity
        );

        res.status(201).json({
            success: true,
            message: "Product added to cart",
            cartItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.getCart(req.user.id);

        res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const removedItem = await Cart.removeFromCart(
            req.user.id,
            productId
        );

        if (!removedItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
};
