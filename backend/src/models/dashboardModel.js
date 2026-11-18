const pool = require("../config/db");

// Get dashboard statistics
const getDashboardStats = async () => {
    const result = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM products) AS total_products,
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT COALESCE(SUM(total_amount), 0) FROM orders) AS total_revenue
    `);

    return result.rows[0];
};
// Get recent orders
const getRecentOrders = async () => {
    const result = await pool.query(`
        SELECT
            orders.id,
            orders.total_amount,
            orders.status,
            orders.created_at,
            users.name AS customer_name,
            users.email AS customer_email
        FROM orders
        JOIN users ON orders.user_id = users.id
        ORDER BY orders.created_at DESC
        LIMIT 5
    `);

    return result.rows;
};

// Get sales analytics for the last 7 days
const getSalesAnalytics = async () => {
    const result = await pool.query(`
        SELECT
            DATE(created_at) AS sale_date,
            COUNT(*) AS total_orders,
            COALESCE(SUM(total_amount), 0) AS total_revenue
        FROM orders
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(created_at)
        ORDER BY sale_date ASC
    `);

    return result.rows;
};

module.exports = {
    getDashboardStats,
    getRecentOrders,
    getSalesAnalytics,
};