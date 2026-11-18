
const express = require("express");
const router = express.Router();

const {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
} = require("../controllers/addressController");

const { protect } = require("../middleware/authMiddleware");

// All address routes require login
router.post("/", protect, addAddress);
router.get("/", protect, getAddresses);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);

module.exports = router;
