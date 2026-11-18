const pool = require("../config/db");

// Create a new order
const createOrder = async (userId, shippingAddress) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Get cart items
        const cartResult = await client.query(
            `SELECT cart_items.product_id, cart_items.quantity,
                    products.price, products.stock
             FROM cart_items
             JOIN products ON cart_items.product_id = products.id
             WHERE cart_items.user_id = $1`,
            [userId]
        );

        const cartItems = cartResult.rows;

        if (cartItems.length === 0) {
            throw new Error("Your cart is empty");
        }

        let totalAmount = 0;

        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                throw new Error("Insufficient product stock");
            }

            totalAmount += Number(item.price) * item.quantity;
        }

        // Create order
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total_amount, shipping_address)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, totalAmount, shippingAddress]
        );

        const order = orderResult.rows[0];
        // Save initial order status history
        await client.query(
            `INSERT INTO order_status_history (order_id, status)
            VALUES ($1, $2)`,
            [order.id, order.status]
        );

        // Get all orders for a user
        
        // Create order items and update stock
        for (const item of cartItems) {
            await client.query(
                `INSERT INTO order_items
                 (order_id, product_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [order.id, item.product_id, item.quantity, item.price]
            );

            await client.query(
                `UPDATE products
                 SET stock = stock - $1
                 WHERE id = $2`,
                [item.quantity, item.product_id]
            );
        }

        // Clear user's cart
        await client.query(
            "DELETE FROM cart_items WHERE user_id = $1",
            [userId]
        );

        await client.query("COMMIT");

        return order;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
};

// Get all orders for a user
const getUserOrders = async (userId) => {
    const result = await pool.query(
        `SELECT *
         FROM orders
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};
// Get all orders (Admin)
const getAllOrders = async () => {
    const result = await pool.query(`
        SELECT
            orders.*,
            users.name AS customer_name,
            users.email AS customer_email
        FROM orders
        JOIN users ON orders.user_id = users.id
        ORDER BY orders.created_at DESC
    `);

    return result.rows;
};

// Get individual order details
const getOrderById = async (orderId, userId) => {
    const orderResult = await pool.query(
        `SELECT *
         FROM orders
         WHERE id = $1 AND user_id = $2`,
        [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
        return null;
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
        `SELECT
            order_items.id,
            order_items.product_id,
            products.name AS product_name,
            products.image_url,
            order_items.quantity,
            order_items.price
         FROM order_items
         JOIN products ON order_items.product_id = products.id
         WHERE order_items.order_id = $1`,
        [orderId]
    );

    return {
        ...order,
        items: itemsResult.rows,
    };
};
// Cancel order (User)
// Cancel order (User)
const cancelOrder = async (orderId, userId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE orders
             SET status = 'Cancelled'
             WHERE id = $1
             AND user_id = $2
             AND status = 'Pending'
             RETURNING *`,
            [orderId, userId]
        );

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        await client.query(
            `INSERT INTO order_status_history (order_id, status)
             VALUES ($1, $2)`,
            [orderId, "Cancelled"]
        );

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
// Update order status (Admin)
// Update order status (Admin)
const updateOrderStatus = async (id, status) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE orders
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        await client.query(
            `INSERT INTO order_status_history (order_id, status)
             VALUES ($1, $2)`,
            [id, status]
        );

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

// Get order status history
const getOrderStatusHistory = async (orderId, userId) => {
    const result = await pool.query(
        `SELECT
            order_status_history.id,
            order_status_history.status,
            order_status_history.changed_at
         FROM order_status_history
         JOIN orders ON order_status_history.order_id = orders.id
         WHERE order_status_history.order_id = $1
         AND orders.user_id = $2
         ORDER BY order_status_history.changed_at ASC`,
        [orderId, userId]
    );

    return result.rows;
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getOrderStatusHistory,
}; 