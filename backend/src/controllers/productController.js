
const Product = require("../models/productModel");

const getProducts = async (req, res) => {
    try {
        const { category, search, sort = "newest" } = req.query;

        const allowedSortOptions = [
            "newest",
            "oldest",
            "price_low",
            "price_high",
        ];

        const safeSort = allowedSortOptions.includes(sort)
            ? sort
            : "newest";

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

        const result = await Product.getAllProducts(
            category,
            search,
            page,
            limit,
            safeSort
        );

        res.status(200).json({
            success: true,
            count: result.products.length,
            totalProducts: result.totalProducts,
            totalPages: Math.ceil(result.totalProducts / limit),
            page,
            limit,
            sort: safeSort,
            products: result.products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all product categories
const getCategories = async (req, res) => {
    try {
        const categories = await Product.getAllCategories();

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const product = await Product.createProduct(req.body);

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.updateProduct(
            req.params.id,
            req.body
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.deleteProduct(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get low stock products (Admin)
const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.getLowStockProducts();

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// Update product stock (Admin)
const updateProductStock = async (req, res) => {
    try {
        const { stock } = req.body;
        const productId = Number(req.params.id);

        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock must be a non-negative integer",
            });
        }

        const product = await Product.updateProductStock(
            productId,
            stock
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product stock updated successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getProducts,
    getProduct,
    getCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    updateProductStock,
};
