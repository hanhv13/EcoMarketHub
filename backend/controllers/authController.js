const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const db     = require('../config/db');
const sendEmail = require('../utils/sendEmail');

// ============================================================
// REGISTER NEW ACCOUNT
// ============================================================
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required information.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email or username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const [result] = await db.query(
            'INSERT INTO users (username, email, password, verification_token) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, verificationToken]
        );

        // Send verification email
        const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
        const message = `Please verify your email by clicking the following link: \n\n ${verifyUrl}`;
        
        try {
            await sendEmail({
                email: email,
                subject: 'Email Verification - EcoMarketHub',
                message: message
            });
        } catch (error) {
            console.error('Email sending failed:', error);
        }

        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// ============================================================
// VERIFY EMAIL
// ============================================================
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({ message: 'Invalid token.' });
        }

        const [users] = await db.query('SELECT id FROM users WHERE verification_token = ?', [token]);
        
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        await db.query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?', [users[0].id]);

        res.json({ message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ message: 'Server error during verification.' });
    }
};

// ============================================================
// LOGIN
// ============================================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter email and password.' });
        }

        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        const user = users[0];

        // Check if verified (Disabled for easier testing since Ethereal emails require backend console access)
        // if (!user.is_verified) {
        //     return res.status(401).json({ message: 'Please verify your email before logging in.' });
        // }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                green_points: user.green_points
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id:         user.id,
                username:   user.username,
                email:      user.email,
                avatar_url: user.avatar_url,
                role:       user.role,
                green_points: user.green_points
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// ============================================================
// FORGOT PASSWORD
// ============================================================
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'No user found with that email address.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Expiry in 1 hour, formatted for MySQL DATETIME
        const expires = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' ');

        await db.query(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
            [resetToken, expires, users[0].id]
        );

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        const message = `You requested a password reset. Please click the following link to set a new password: \n\n ${resetUrl}`;
        
        try {
            await sendEmail({
                email: email,
                subject: 'Password Reset - EcoMarketHub',
                message: message
            });
            res.json({ message: 'Password reset link sent to your email.' });
        } catch (error) {
            console.error('Email sending failed:', error);
            await db.query('UPDATE users SET reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?', [users[0].id]);
            res.status(500).json({ message: 'Failed to send reset email.' });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// ============================================================
// RESET PASSWORD
// ============================================================
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        const [users] = await db.query(
            'SELECT id FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
            [token]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Token is invalid or has expired.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, users[0].id]
        );

        res.json({ message: 'Password successfully reset. You can now log in.' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// ============================================================
// GET CURRENT USER INFO
// ============================================================
const getMe = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, email, avatar_url, role, green_points, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// ============================================================
// ADD POINTS
// ============================================================
const addPoints = async (req, res) => {
    try {
        let { points } = req.body;
        if (!points || points <= 0) return res.status(400).json({ message: 'Invalid points amount.' });
        
        // Cap event/generic addition to 2000 max
        if (points > 2000) points = 2000;
        
        await db.query('UPDATE users SET green_points = green_points + ? WHERE id = ?', [points, req.user.id]);
        
        const [users] = await db.query('SELECT green_points FROM users WHERE id = ?', [req.user.id]);
        res.json({ message: 'Points added successfully!', green_points: users[0].green_points });
    } catch (error) {
        console.error('addPoints error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// ============================================================
// DEDUCT POINTS
// ============================================================
const deductPoints = async (req, res) => {
    try {
        const { points } = req.body;
        if (!points || points <= 0) return res.status(400).json({ message: 'Invalid points amount.' });
        
        const [users] = await db.query('SELECT green_points FROM users WHERE id = ?', [req.user.id]);
        if (users[0].green_points < points) {
            return res.status(400).json({ message: 'Not enough points.' });
        }

        await db.query('UPDATE users SET green_points = green_points - ? WHERE id = ?', [points, req.user.id]);
        res.json({ message: 'Points deducted successfully!', green_points: users[0].green_points - points });
    } catch (error) {
        console.error('deductPoints error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = { register, login, getMe, addPoints, deductPoints, verifyEmail, forgotPassword, resetPassword };
