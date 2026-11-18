const pool = require("../config/db");

// Add product to wishlist
const addToWishlist = async (userId, productId) => {
    const result = await pool.query(
        `INSERT INTO wishlist (user_id, product_id)
         VALUES ($1, $2)
         RETURNING *`,
        [userId, productId]
    );

    return result.rows[0];
};

// Get user's wishlist
const getWishlist = async (userId) => {
    const result = await pool.query(
        `SELECT
            wishlist.id,
            wishlist.product_id,
            wishlist.created_at,
            products.name,
            products.description,
            products.price,
            products.image_url,
            products.category,
            products.stock
         FROM wishlist
         JOIN products ON wishlist.product_id = products.id
         WHERE wishlist.user_id = $1
         ORDER BY wishlist.created_at DESC`,
        [userId]
    );

    return result.rows;
};

// Remove product from wishlist
const removeFromWishlist = async (userId, productId) => {
    const result = await pool.query(
        `DELETE FROM wishlist
         WHERE user_id = $1 AND product_id = $2
         RETURNING *`,
        [userId, productId]
    );

    return result.rows[0];
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
};