
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const existingUser = await User.findUserByEmail(email.trim());

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.createUser(
            name.trim(),
            email.trim(),
            hashedPassword
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, accountType, businessId } = req.body;

        if (!email || !password || !accountType) {
            return res.status(400).json({
                success: false,
                message: "Email, password and account type are required",
            });
        }

        if (!["user", "admin"].includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type",
            });
        }

        const user = await User.findUserByEmail(email.trim());

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (accountType === "admin") {
            if (
                !process.env.BUSINESS_ID ||
                businessId !== process.env.BUSINESS_ID ||
                user.role !== "admin"
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Admin access denied. Check your account type and Business ID.",
                });
            }
        } else if (user.role !== "user") {
            return res.status(403).json({
                success: false,
                message: "This account is not registered as a Customer.",
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required",
            });
        }

        const existingUser = await User.findUserByEmail(email.trim());

        if (existingUser && existingUser.id !== userId) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        const updatedUser = await User.updateUserProfile(
            userId,
            name.trim(),
            email.trim()
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateProfile,
};
