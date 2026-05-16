const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route to create a new rental (requires user to be logged in)
router.post('/', verifyToken, rentalController.createRental);

// Route to get all booked rentals for a specific product
router.get('/:productId', rentalController.getProductRentals);

module.exports = router;
