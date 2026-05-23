const db = require('../config/db');

// --- USERS ---
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, email, role, green_points, created_at FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        res.json({ message: 'Cập nhật role thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

const deleteUser = async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'Đã xóa người dùng.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// --- CATEGORIES ---
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
        res.json({ message: 'Tạo category thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id]);
        res.json({ message: 'Cập nhật category thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Đã xóa category.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// --- PRODUCTS ---
const getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT p.id, p.title, p.price, p.type, p.status, u.username as seller_name
            FROM products p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Đã xóa sản phẩm.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// --- EVENTS ---
const createEvent = async (req, res) => {
    try {
        const { title, description, location, event_date, image_url } = req.body;
        await db.query(
            'INSERT INTO events (user_id, title, description, location, event_date, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, title, description, location, event_date, image_url]
        );
        res.json({ message: 'Tạo event thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { title, description, location, event_date, image_url } = req.body;
        await db.query(
            'UPDATE events SET title=?, description=?, location=?, event_date=?, image_url=? WHERE id=?',
            [title, description, location, event_date, image_url, req.params.id]
        );
        res.json({ message: 'Cập nhật event thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ message: 'Đã xóa event.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

module.exports = {
    getAllUsers, updateUserRole, deleteUser,
    createCategory, updateCategory, deleteCategory,
    getAllProducts, deleteProduct,
    createEvent, updateEvent, deleteEvent
};
