const db = require('../config/db');

// ============================================================
// CREATE A NEW RENTAL BOOKING
// ============================================================
const createRental = async (req, res) => {
    try {
        const { product_id, start_date, end_date } = req.body;
        const user_id = req.user.id;

        if (!product_id || !start_date || !end_date) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validation
        if (startDate < today) {
            return res.status(400).json({ message: 'Start date cannot be in the past.' });
        }
        if (endDate < startDate) {
            return res.status(400).json({ message: 'End date must be after start date.' });
        }

        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        if (daysDiff > 30) {
            return res.status(400).json({ message: 'Rental duration cannot exceed 1 month.' });
        }

        // Check for overlapping rentals
        const [overlapping] = await db.query(
            `SELECT id FROM rentals 
             WHERE product_id = ? 
             AND (
                 (start_date <= ? AND end_date >= ?) OR
                 (start_date <= ? AND end_date >= ?) OR
                 (start_date >= ? AND end_date <= ?)
             )`,
            [product_id, start_date, start_date, end_date, end_date, start_date, end_date]
        );

        if (overlapping.length > 0) {
            return res.status(400).json({ message: 'The selected dates are already booked.' });
        }

        // Insert new rental
        const [result] = await db.query(
            'INSERT INTO rentals (product_id, user_id, start_date, end_date) VALUES (?, ?, ?, ?)',
            [product_id, user_id, start_date, end_date]
        );

        res.status(201).json({ message: 'Rental booked successfully!', rentalId: result.insertId });
    } catch (error) {
        console.error('createRental error:', error);
        res.status(500).json({ message: 'Server error while booking rental.' });
    }
};

// ============================================================
// GET ALL BOOKED RENTALS FOR A PRODUCT
// ============================================================
const getProductRentals = async (req, res) => {
    try {
        const { productId } = req.params;

        const [rentals] = await db.query(
            'SELECT start_date, end_date FROM rentals WHERE product_id = ? AND end_date >= CURDATE()',
            [productId]
        );

        res.json(rentals);
    } catch (error) {
        console.error('getProductRentals error:', error);
        res.status(500).json({ message: 'Server error while fetching rentals.' });
    }
};

module.exports = {
    createRental,
    getProductRentals
};
