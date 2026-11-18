const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    updateUserRole,
    deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Admin: Get all users
router.get("/", protect, admin, getAllUsers);
// Admin: Update user role
router.put("/:id/role", protect, admin, updateUserRole);
// Admin: Delete user
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;