
const pool = require("../config/db");

// Add product to cart
const addToCart = async (userId, productId, quantity) => {
    const result = await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, product_id)
         DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
         RETURNING *`,
        [userId, productId, quantity]
    );

    return result.rows[0];
};

// Get user's cart
const getCart = async (userId) => {
    const result = await pool.query(
        `SELECT
            cart_items.id,
            cart_items.product_id,
            products.name,
            products.price,
            products.image_url,
            cart_items.quantity,
            (products.price * cart_items.quantity) AS subtotal
         FROM cart_items
         JOIN products ON cart_items.product_id = products.id
         WHERE cart_items.user_id = $1
         ORDER BY cart_items.id DESC`,
        [userId]
    );

    return result.rows;
};

// Remove product from cart
const removeFromCart = async (userId, productId) => {
    const result = await pool.query(
        `DELETE FROM cart_items
         WHERE user_id = $1 AND product_id = $2
         RETURNING *`,
        [userId, productId]
    );

    return result.rows[0];
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
};
