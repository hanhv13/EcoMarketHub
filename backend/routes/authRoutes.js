// ============================================================
// FILE: backend/routes/authRoutes.js
// NGƯỜI PHỤ TRÁCH: M1
// ============================================================
const express = require('express');
const router  = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register — Đăng ký (không cần token)
router.post('/register', register);

// POST /api/auth/login — Đăng nhập (không cần token)
router.post('/login', login);

// GET /api/auth/me — Lấy thông tin user hiện tại (cần token)
router.get('/me', authMiddleware, getMe);

module.exports = router;
