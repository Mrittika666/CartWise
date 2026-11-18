
const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProduct,
    getCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    updateProductStock,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProduct);

// Admin: Get low stock products
router.get("/admin/low-stock", protect, admin, getLowStockProducts);

// Admin-only route
router.post("/", protect, admin, addProduct);
router.put("/:id", protect, admin, updateProduct);
// Admin: Update product stock
router.patch("/:id/stock", protect, admin, updateProductStock);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
