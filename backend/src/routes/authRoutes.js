
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    updateProfile,
} = require("../controllers/authController");


const {
    sendPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
} = require("../controllers/passwordResetController");



router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateProfile);

// Forgot Password OTP routes
router.post("/forgot-password", sendPasswordResetOtp);
router.post("/verify-reset-otp", verifyPasswordResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
