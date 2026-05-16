// ============================================================
// FILE: backend/controllers/reviewController.js
// FUNCTION: Handle seller rating logic
// ============================================================

const db = require('../config/db');

// Get list of reviews for a seller
const getReviewsBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const [reviews] = await db.query(`
            SELECT r.*, u.username AS reviewer_name, u.avatar_url AS reviewer_avatar
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.seller_id = ?
            ORDER BY r.created_at DESC
        `, [sellerId]);
        
        // Calculate average rating
        const [avgResult] = await db.query('SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE seller_id = ?', [sellerId]);
        
        res.json({
            reviews,
            stats: {
                averageRating: parseFloat(avgResult[0].avgRating || 0).toFixed(1),
                totalReviews: avgResult[0].count
            }
        });
    } catch (error) {
        console.error('getReviewsBySeller error:', error);
        res.status(500).json({ message: 'Server error while fetching reviews.' });
    }
};

// Post new review
const createReview = async (req, res) => {
    try {
        const { seller_id, rating, comment } = req.body;
        const reviewer_id = req.user.id;

        if (seller_id == reviewer_id) {
            return res.status(400).json({ message: 'You cannot rate yourself.' });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        await db.query(
            'INSERT INTO reviews (seller_id, reviewer_id, rating, comment) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP',
            [seller_id, reviewer_id, rating, comment, rating, comment]
        );

        res.status(201).json({ message: 'Review posted successfully!' });
    } catch (error) {
        console.error('createReview error:', error);
        res.status(500).json({ message: 'Server error while posting review.' });
    }
};

module.exports = { getReviewsBySeller, createReview };
