
const Address = require("../models/addressModel");

// Add address
const addAddress = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            addressLine1,
            city,
            state,
            postalCode,
        } = req.body;

        if (
            !fullName ||
            !phone ||
            !addressLine1 ||
            !city ||
            !state ||
            !postalCode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required address fields.",
            });
        }

        const address = await Address.addAddress(req.user.id, req.body);

        res.status(201).json({
            success: true,
            message: "Address added successfully.",
            address,
        });
    } catch (error) {
        console.error("Add address error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add address.",
        });
    }
};

// Get user addresses
const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.getUserAddresses(req.user.id);

        res.status(200).json({
            success: true,
            addresses,
        });
    } catch (error) {
        console.error("Get addresses error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch addresses.",
        });
    }
};

// Update address
const updateAddress = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            addressLine1,
            city,
            state,
            postalCode,
        } = req.body;

        if (
            !fullName ||
            !phone ||
            !addressLine1 ||
            !city ||
            !state ||
            !postalCode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required address fields.",
            });
        }

        const address = await Address.updateAddress(
            req.user.id,
            req.params.id,
            req.body
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Address updated successfully.",
            address,
        });
    } catch (error) {
        console.error("Update address error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update address.",
        });
    }
};

// Delete address
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.deleteAddress(
            req.user.id,
            req.params.id
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully.",
        });
    } catch (error) {
        console.error("Delete address error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete address.",
        });
    }
};

module.exports = {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
};
