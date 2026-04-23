// ============================================================
// FILE: backend/controllers/favoriteController.js
// CHỨC NĂNG: Xử lý logic thêm/xoá/lấy danh sách yêu thích
// NGƯỜI PHỤ TRÁCH: M2
// ============================================================

const db = require('../config/db');

// ============================================================
// LẤY DANH SÁCH SẢN PHẨM YÊU THÍCH CỦA USER HIỆN TẠI
// GET /api/favorites
// ============================================================
const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ JWT token

        const [favorites] = await db.query(`
            SELECT
                f.id AS favorite_id, f.created_at AS favorited_at,
                p.id, p.title, p.price, p.image_url, p.type, p.status,
                u.username AS seller_name,
                c.name AS category_name
            FROM favorites f
            JOIN products p ON f.product_id = p.id
            JOIN users u ON p.user_id = u.id
            JOIN categories c ON p.category_id = c.id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
        `, [userId]);

        res.json(favorites);

    } catch (error) {
        console.error('Lỗi getFavorites:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// ============================================================
// THÊM SẢN PHẨM VÀO YÊU THÍCH
// POST /api/favorites/:productId
// ============================================================
const addFavorite = async (req, res) => {
    try {
        const userId    = req.user.id;
        const productId = req.params.productId;

        // Kiểm tra sản phẩm có tồn tại không
        const [products] = await db.query(
            'SELECT id FROM products WHERE id = ?', [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
        }

        // Kiểm tra đã yêu thích chưa
        const [existing] = await db.query(
            'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'Bạn đã yêu thích sản phẩm này rồi.' });
        }

        // Thêm vào bảng favorites
        await db.query(
            'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );

        res.status(201).json({ message: 'Đã thêm vào yêu thích!' });

    } catch (error) {
        console.error('Lỗi addFavorite:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// ============================================================
// XOÁ SẢN PHẨM KHỎI YÊU THÍCH
// DELETE /api/favorites/:productId
// ============================================================
const removeFavorite = async (req, res) => {
    try {
        const userId    = req.user.id;
        const productId = req.params.productId;

        const [result] = await db.query(
            'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy trong danh sách yêu thích.' });
        }

        res.json({ message: 'Đã xoá khỏi yêu thích.' });

    } catch (error) {
        console.error('Lỗi removeFavorite:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// ============================================================
// KIỂM TRA 1 SẢN PHẨM CÓ ĐANG ĐƯỢC YÊU THÍCH KHÔNG
// GET /api/favorites/check/:productId
// ============================================================
const checkFavorite = async (req, res) => {
    try {
        const userId    = req.user.id;
        const productId = req.params.productId;

        const [rows] = await db.query(
            'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        res.json({ isFavorited: rows.length > 0 });

    } catch (error) {
        console.error('Lỗi checkFavorite:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };
