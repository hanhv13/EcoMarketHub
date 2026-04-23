// ============================================================
// FILE: backend/routes/categoryRoutes.js
// NGƯỜI PHỤ TRÁCH: M2
// ============================================================
const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET /api/categories — Lấy toàn bộ danh mục (để hiển thị dropdown lọc)
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
