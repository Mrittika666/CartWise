
const pool = require("../config/db");

const getAllProducts = async (
    category = null,
    search = null,
    page = 1,
    limit = 10,
    sort = "newest"
) => {
    let query = "SELECT * FROM products";
    let countQuery = "SELECT COUNT(*) FROM products";

    const values = [];
    const conditions = [];

    if (category) {
        values.push(category);
        conditions.push(`LOWER(category) = LOWER($${values.length})`);
    }

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`name ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
        const whereClause = " WHERE " + conditions.join(" AND ");
        query += whereClause;
        countQuery += whereClause;
    }

    const countResult = await pool.query(countQuery, values);
    const totalProducts = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const productValues = [...values, limit, offset];

    let orderBy = "id DESC";

    if (sort === "price_low") {
        orderBy = "price ASC";
    } else if (sort === "price_high") {
        orderBy = "price DESC";
    } else if (sort === "oldest") {
        orderBy = "created_at ASC";
    }

    query += ` ORDER BY ${orderBy} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

    const result = await pool.query(query, productValues);

    return {
        products: result.rows,
        totalProducts,
    };
};

const getProductById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

// Get all unique product categories
const getAllCategories = async () => {
    const result = await pool.query(
        `SELECT DISTINCT category
         FROM products
         WHERE category IS NOT NULL
         AND category != ''
         ORDER BY category ASC`
    );

    return result.rows.map((row) => row.category);
};

const createProduct = async (product) => {
    const { name, description, price, image_url, category, stock } = product;

    const result = await pool.query(
        `INSERT INTO products
    (name, description, price, image_url, category, stock)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
        [name, description, price, image_url, category, stock]
    );

    return result.rows[0];
};

// Update product
const updateProduct = async (id, product) => {
    const { name, description, price, image_url, category, stock } = product;

    const result = await pool.query(
        `UPDATE products
         SET name = $1,
             description = $2,
             price = $3,
             image_url = $4,
             category = $5,
             stock = $6
         WHERE id = $7
         RETURNING *`,
        [name, description, price, image_url, category, stock, id]
    );

    return result.rows[0];
};

// Delete product
const deleteProduct = async (id) => {
    const result = await pool.query(
        `DELETE FROM products
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

// Get low stock products (Admin)
const getLowStockProducts = async () => {
    const result = await pool.query(
        `SELECT *
         FROM products
         WHERE stock <= 5
         ORDER BY stock ASC`
    );

    return result.rows;
};

// Update product stock (Admin)
const updateProductStock = async (id, stock) => {
    const result = await pool.query(
        `UPDATE products
         SET stock = $1
         WHERE id = $2
         RETURNING *`,
        [stock, id]
    );

    return result.rows[0];
};

module.exports = {
    getAllProducts,
    getProductById,
    getAllCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    updateProductStock,
};
