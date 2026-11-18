const User = require("../models/userModel");

// Get all users (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update user role (Admin)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = Number(req.params.id);

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be user or admin",
            });
        }

        if (userId === Number(req.user.id) && role !== "admin") {
            return res.status(400).json({
                success: false,
                message: "You cannot remove your own admin role",
            });
        }

        const user = await User.updateUserRole(userId, role);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Delete user (Admin)
const deleteUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (userId === Number(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account",
            });
        }

        const user = await User.deleteUser(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser,
};