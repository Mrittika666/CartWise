
const pool = require("../config/db");

// Add a new address
const addAddress = async (userId, address) => {
    const {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
        postalCode,
        country,
        isDefault,
    } = address;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        if (isDefault) {
            await client.query(
                "UPDATE addresses SET is_default = FALSE WHERE user_id = $1",
                [userId]
            );
        }

        const result = await client.query(
            `INSERT INTO addresses
            (user_id, full_name, phone, address_line1, address_line2,
             landmark, city, state, postal_code, country, is_default)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [
                userId,
                fullName,
                phone,
                addressLine1,
                addressLine2 || null,
                landmark || null,
                city,
                state,
                postalCode,
                country || "India",
                Boolean(isDefault),
            ]
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

// Get all addresses of a user
const getUserAddresses = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM addresses
         WHERE user_id = $1
         ORDER BY is_default DESC, created_at DESC`,
        [userId]
    );

    return result.rows;
};

// Update an address
const updateAddress = async (userId, addressId, address) => {
    const {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
        postalCode,
        country,
        isDefault,
    } = address;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        if (isDefault) {
            await client.query(
                "UPDATE addresses SET is_default = FALSE WHERE user_id = $1",
                [userId]
            );
        }

        const result = await client.query(
            `UPDATE addresses
             SET full_name = $1,
                 phone = $2,
                 address_line1 = $3,
                 address_line2 = $4,
                 landmark = $5,
                 city = $6,
                 state = $7,
                 postal_code = $8,
                 country = $9,
                 is_default = $10
             WHERE id = $11 AND user_id = $12
             RETURNING *`,
            [
                fullName,
                phone,
                addressLine1,
                addressLine2 || null,
                landmark || null,
                city,
                state,
                postalCode,
                country || "India",
                Boolean(isDefault),
                addressId,
                userId,
            ]
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

// Delete an address
const deleteAddress = async (userId, addressId) => {
    const result = await pool.query(
        `DELETE FROM addresses
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [addressId, userId]
    );

    return result.rows[0];
};

module.exports = {
    addAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress,
};
