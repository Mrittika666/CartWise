
const pool = require("../config/db");

const createUser = async (name, email, hashedPassword) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, role, created_at`,
        [name, email, hashedPassword]
    );

    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0];
};

const getAllUsers = async () => {
    const result = await pool.query(`
        SELECT id, name, email, role, created_at
        FROM users
        ORDER BY created_at DESC
    `);

    return result.rows;
};

const updateUserRole = async (id, role) => {
    const result = await pool.query(
        `UPDATE users
         SET role = $1
         WHERE id = $2
         RETURNING id, name, email, role, created_at`,
        [role, id]
    );

    return result.rows[0];
};

const deleteUser = async (id) => {
    const result = await pool.query(
        `DELETE FROM users
         WHERE id = $1
         RETURNING id, name, email, role`,
        [id]
    );

    return result.rows[0];
};

// Create Password Reset OTP
const createPasswordResetOtp = async (userId, otpHash, expiresAt) => {
    await pool.query(
        "DELETE FROM password_reset_otps WHERE user_id = $1",
        [userId]
    );

    const result = await pool.query(
        `INSERT INTO password_reset_otps
         (user_id, otp_hash, expires_at)
         VALUES ($1, $2, $3)
         RETURNING id, user_id, expires_at`,
        [userId, otpHash, expiresAt]
    );

    return result.rows[0];
};

// Find Password Reset OTP
const getPasswordResetOtp = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM password_reset_otps
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId]
    );

    return result.rows[0];
};

// Verify OTP
const markOtpVerified = async (id) => {
    const result = await pool.query(
        `UPDATE password_reset_otps
         SET is_verified = TRUE
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

// Update User Profile
const updateUserProfile = async (userId, name, email) => {
    const result = await pool.query(
        `UPDATE users
         SET name = $1, email = $2
         WHERE id = $3
         RETURNING id, name, email, role, created_at`,
        [name, email, userId]
    );

    return result.rows[0];
};

// Update Password
const updatePassword = async (userId, hashedPassword) => {
    const result = await pool.query(
        `UPDATE users
         SET password = $1
         WHERE id = $2
         RETURNING id, name, email`,
        [hashedPassword, userId]
    );

    return result.rows[0];
};

// Delete Used OTP
const deletePasswordResetOtps = async (userId) => {
    await pool.query(
        "DELETE FROM password_reset_otps WHERE user_id = $1",
        [userId]
    );
};

module.exports = {
    createUser,
    findUserByEmail,
    getAllUsers,
    updateUserRole,
    deleteUser,
    createPasswordResetOtp,
    getPasswordResetOtp,
    markOtpVerified,
    updatePassword,
    updateUserProfile,
    deletePasswordResetOtps,
};
