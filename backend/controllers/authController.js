// ============================================================
// FILE: backend/controllers/authController.js
// CHỨC NĂNG: Xử lý logic đăng ký và đăng nhập
// NGƯỜI PHỤ TRÁCH: M1
// ============================================================

const bcrypt = require('bcryptjs');  // Thư viện mã hoá mật khẩu
const jwt    = require('jsonwebtoken'); // Thư viện tạo token
const db     = require('../config/db'); // Kết nối database

// ============================================================
// ĐĂNG KÝ TÀI KHOẢN MỚI
// POST /api/auth/register
// Body: { username, email, password }
// ============================================================
const register = async (req, res) => {
    try {
        // Lấy thông tin từ body request (React gửi lên)
        const { username, email, password } = req.body;

        // Validation cơ bản — kiểm tra thiếu trường
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
        }

        // Kiểm tra email đã tồn tại chưa
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]  // Dấu ? là placeholder, tránh SQL Injection
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email hoặc tên đăng nhập đã tồn tại.' });
        }

        // Mã hoá mật khẩu trước khi lưu vào DB
        // 10 là "salt rounds" — càng cao càng an toàn nhưng chậm hơn
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lưu user mới vào database
        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Trả về thành công (không trả password)
        res.status(201).json({
            message: 'Đăng ký thành công!',
            userId: result.insertId  // ID của user vừa tạo
        });

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký.' });
    }
};

// ============================================================
// ĐĂNG NHẬP
// POST /api/auth/login
// Body: { email, password }
// ============================================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
        }

        // Tìm user theo email
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        // Không tìm thấy user
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        const user = users[0]; // Lấy user đầu tiên (và duy nhất)

        // So sánh mật khẩu nhập vào với mật khẩu đã mã hoá trong DB
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Tạo JWT token — chứa thông tin user (không chứa password!)
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET,        // Khoá bí mật để ký token
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Token hết hạn sau 7 ngày
        );

        // Trả về token và thông tin user cơ bản (React sẽ lưu token vào localStorage)
        res.json({
            message: 'Đăng nhập thành công!',
            token,
            user: {
                id:         user.id,
                username:   user.username,
                email:      user.email,
                avatar_url: user.avatar_url
            }
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
};

// ============================================================
// LẤY THÔNG TIN USER HIỆN TẠI (dùng token để xác thực)
// GET /api/auth/me
// Header: Authorization: Bearer <token>
// ============================================================
const getMe = async (req, res) => {
    try {
        // req.user được gắn vào bởi authMiddleware
        const [users] = await db.query(
            'SELECT id, username, email, avatar_url, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy user.' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Lỗi getMe:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

module.exports = { register, login, getMe };
