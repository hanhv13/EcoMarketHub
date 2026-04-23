// ============================================================
// FILE: backend/routes/favoriteRoutes.js
// NGƯỜI PHỤ TRÁCH: M2
// ============================================================
const express = require('express');
const router  = express.Router();
const { getFavorites, addFavorite, removeFavorite, checkFavorite } = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// Tất cả route yêu thích đều cần đăng nhập
router.get('/',                       authMiddleware, getFavorites);   // Lấy danh sách yêu thích
router.get('/check/:productId',       authMiddleware, checkFavorite);  // Kiểm tra đã yêu thích chưa
router.post('/:productId',            authMiddleware, addFavorite);    // Thêm yêu thích
router.delete('/:productId',          authMiddleware, removeFavorite); // Xoá yêu thích

module.exports = router;
