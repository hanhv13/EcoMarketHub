const express = require('express');
const router  = express.Router();
const { register, login, getMe, addPoints, deductPoints, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/verify-email
router.get('/verify-email', verifyEmail);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', resetPassword);

// GET /api/auth/me
router.get('/me', authMiddleware, getMe);

// POST /api/auth/points/add
router.post('/points/add', authMiddleware, addPoints);

// POST /api/auth/points/deduct
router.post('/points/deduct', authMiddleware, deductPoints);

module.exports = router;
