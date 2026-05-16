const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET /api/categories
router.get('/', async (req, res) => {
    try {
        const [categories] = await db.query(
            'SELECT * FROM categories ORDER BY name ASC'
        );
        res.json(categories);
    } catch (error) {
        console.error('Lỗi lấy categories:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
});

module.exports = router;