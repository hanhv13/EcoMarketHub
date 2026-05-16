const express = require('express');
const router  = express.Router();
const { getReviewsBySeller, createReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:sellerId', getReviewsBySeller);
router.post('/', authMiddleware, createReview);

module.exports = router;
