const Dashboard = require("../models/dashboardModel");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const stats = await Dashboard.getDashboardStats();

        res.status(200).json({
            success: true,
            stats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get recent orders
const getRecentOrders = async (req, res) => {
    try {
        const orders = await Dashboard.getRecentOrders();

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get sales analytics
const getSalesAnalytics = async (req, res) => {
    try {
        const sales = await Dashboard.getSalesAnalytics();

        res.status(200).json({
            success: true,
            sales,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { getDashboardStats, getRecentOrders, getSalesAnalytics };