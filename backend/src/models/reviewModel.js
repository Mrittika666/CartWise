const pool = require("../config/db");

// Add product review
const createReview = async (userId, productId, rating, comment) => {
    const result = await pool.query(
        `INSERT INTO reviews
        (user_id, product_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [userId, productId, rating, comment]
    );

    return result.rows[0];
};

// Get reviews for a product
const getProductReviews = async (productId) => {
    const result = await pool.query(
        `SELECT
            reviews.*,
            users.name AS user_name
         FROM reviews
         JOIN users ON reviews.user_id = users.id
         WHERE reviews.product_id = $1
         ORDER BY reviews.created_at DESC`,
        [productId]
    );

    return result.rows;
};

// Get average rating
const getProductRating = async (productId) => {
    const result = await pool.query(
        `SELECT
            ROUND(AVG(rating), 1) AS average_rating,
            COUNT(*) AS total_reviews
         FROM reviews
         WHERE product_id = $1`,
        [productId]
    );

    return result.rows[0];
};

module.exports = {
    createReview,
    getProductReviews,
    getProductRating,
};