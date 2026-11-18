
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const {
    findUserByEmail,
    createPasswordResetOtp,
    getPasswordResetOtp,
    markOtpVerified,
    updatePassword,
    deletePasswordResetOtps,
} = require("../models/userModel");

const { sendOtpEmail } = require("../utils/emailService");

// Send OTP to registered email
const sendPasswordResetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await findUserByEmail(email);

        // Generic response avoids revealing whether an account exists
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If the email is registered, an OTP will be sent.",
            });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await createPasswordResetOtp(user.id, otpHash, expiresAt);
        await sendOtpEmail(user.email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email address.",
        });
    } catch (error) {
        console.error("Send OTP error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to send OTP. Please try again.",
        });
    }
};

// Verify OTP
const verifyPasswordResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        const savedOtp = await getPasswordResetOtp(user.id);

        if (
            !savedOtp ||
            savedOtp.is_verified ||
            new Date(savedOtp.expires_at) < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        const isMatch = await bcrypt.compare(otp, savedOtp.otp_hash);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        await markOtpVerified(savedOtp.id);

        const resetToken = jwt.sign(
            {
                id: user.id,
                purpose: "password-reset",
            },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
        );

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully.",
            resetToken,
        });
    } catch (error) {
        console.error("Verify OTP error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to verify OTP.",
        });
    }
};

// Set new password
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Reset token and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired reset session",
            });
        }

        if (decoded.purpose !== "password-reset") {
            return res.status(401).json({
                success: false,
                message: "Invalid reset session",
            });
        }

        const savedOtp = await getPasswordResetOtp(decoded.id);

        if (
            !savedOtp ||
            !savedOtp.is_verified ||
            new Date(savedOtp.expires_at) < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please verify a fresh OTP first",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await updatePassword(decoded.id, hashedPassword);
        await deletePasswordResetOtps(decoded.id);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login.",
        });
    } catch (error) {
        console.error("Reset password error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to reset password.",
        });
    }
};

module.exports = {
    sendPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
};
