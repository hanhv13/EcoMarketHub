// ============================================================
// FILE: backend/routes/productRoutes.js
// NGƯỜI PHỤ TRÁCH: M2
// ============================================================
const express = require('express');
const router  = express.Router();
const {
    getAllProducts, getProductById, createProduct,
    updateProduct, deleteProduct, getProductsByUser
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/products?search=&category=&type=&page= — Lấy danh sách (ai cũng xem được)
router.get('/', getAllProducts);

// GET /api/products/user/:userId — Tin của 1 user (ai cũng xem được)
// QUAN TRỌNG: Route này phải đặt TRƯỚC /:id để tránh bị nhầm lẫn
router.get('/user/:userId', getProductsByUser);

// GET /api/products/:id — Xem chi tiết 1 sản phẩm
router.get('/:id', getProductById);

// POST /api/products — Đăng tin mới (cần đăng nhập)
router.post('/', authMiddleware, createProduct);

// PUT /api/products/:id — Sửa tin (cần đăng nhập + phải là chủ tin)
router.put('/:id', authMiddleware, updateProduct);

// DELETE /api/products/:id — Xoá tin (cần đăng nhập + phải là chủ tin)
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
