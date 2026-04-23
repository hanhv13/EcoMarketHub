// ============================================================
// FILE: backend/controllers/productController.js
// CHỨC NĂNG: Xử lý toàn bộ logic liên quan đến sản phẩm
//            - Lấy danh sách (có tìm kiếm + lọc)
//            - Xem chi tiết
//            - Tạo mới, sửa, xoá
//            - Lấy tin của 1 user
// NGƯỜI PHỤ TRÁCH: M2
// ============================================================

const db = require('../config/db');

// ============================================================
// LẤY DANH SÁCH SẢN PHẨM (có tìm kiếm + lọc + phân trang)
// GET /api/products?search=laptop&category=1&type=sell&page=1
// ============================================================
const getAllProducts = async (req, res) => {
    try {
        // Lấy các tham số filter từ URL query string
        const { search, category, type, page = 1, limit = 12 } = req.query;

        // Xây dựng câu SQL động dựa trên các filter
        let sql = `
            SELECT
                p.id, p.title, p.description, p.price, p.image_url,
                p.type, p.status, p.created_at,
                u.id AS seller_id, u.username AS seller_name, u.avatar_url AS seller_avatar,
                c.id AS category_id, c.name AS category_name
            FROM products p
            JOIN users u ON p.user_id = u.id
            JOIN categories c ON p.category_id = c.id
            WHERE p.status = 'active'
        `;

        const params = []; // Mảng chứa giá trị cho các dấu ?

        // Thêm điều kiện tìm kiếm theo từ khoá (tìm trong tên và mô tả)
        if (search) {
            sql += ' AND (p.title LIKE ? OR p.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`); // % = wildcard trong SQL
        }

        // Thêm điều kiện lọc theo danh mục
        if (category) {
            sql += ' AND p.category_id = ?';
            params.push(parseInt(category));
        }

        // Thêm điều kiện lọc theo loại: sell hoặc rent
        if (type && ['sell', 'rent'].includes(type)) {
            sql += ' AND p.type = ?';
            params.push(type);
        }

        // Sắp xếp mới nhất lên đầu
        sql += ' ORDER BY p.created_at DESC';

        // Phân trang: LIMIT = số sản phẩm mỗi trang, OFFSET = bỏ qua bao nhiêu sản phẩm
        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [products] = await db.query(sql, params);

        // Đếm tổng số sản phẩm (để frontend biết có bao nhiêu trang)
        let countSql = `
            SELECT COUNT(*) AS total
            FROM products p
            WHERE p.status = 'active'
        `;
        const countParams = [];
        if (search) {
            countSql += ' AND (p.title LIKE ? OR p.description LIKE ?)';
            countParams.push(`%${search}%`, `%${search}%`);
        }
        if (category) {
            countSql += ' AND p.category_id = ?';
            countParams.push(parseInt(category));
        }
        if (type && ['sell', 'rent'].includes(type)) {
            countSql += ' AND p.type = ?';
            countParams.push(type);
        }

        const [countResult] = await db.query(countSql, countParams);
        const total = countResult[0].total;

        res.json({
            products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Lỗi getAllProducts:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm.' });
    }
};

// ============================================================
// LẤY CHI TIẾT 1 SẢN PHẨM
// GET /api/products/:id
// ============================================================
const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ URL: /api/products/5 → id = '5'

        const [products] = await db.query(`
            SELECT
                p.*,
                u.id AS seller_id, u.username AS seller_name,
                u.email AS seller_email, u.avatar_url AS seller_avatar,
                c.name AS category_name
            FROM products p
            JOIN users u ON p.user_id = u.id
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [id]);

        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
        }

        res.json(products[0]);

    } catch (error) {
        console.error('Lỗi getProductById:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// ============================================================
// TẠO SẢN PHẨM MỚI (cần đăng nhập)
// POST /api/products
// Header: Authorization: Bearer <token>
// Body: { title, description, price, category_id, type, image_url }
// ============================================================
const createProduct = async (req, res) => {
    try {
        const { title, description, price, category_id, type, image_url } = req.body;

        // Validation
        if (!title || !price || !category_id) {
            return res.status(400).json({ message: 'Vui lòng nhập tên sản phẩm, giá và danh mục.' });
        }

        if (isNaN(price) || parseFloat(price) < 0) {
            return res.status(400).json({ message: 'Giá không hợp lệ.' });
        }

        // req.user.id được lấy từ JWT token (authMiddleware đã decode)
        const userId = req.user.id;

        const [result] = await db.query(
            `INSERT INTO products (user_id, category_id, title, description, price, image_url, type)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, category_id, title, description || '', price, image_url || null, type || 'sell']
        );

        // Lấy sản phẩm vừa tạo để trả về
        const [newProduct] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            message: 'Đăng tin thành công!',
            product: newProduct[0]
        });

    } catch (error) {
        console.error('Lỗi createProduct:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo sản phẩm.' });
    }
};

// ============================================================
// CẬP NHẬT SẢN PHẨM (chỉ chủ tin mới được sửa)
// PUT /api/products/:id
// ============================================================
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Kiểm tra sản phẩm có tồn tại và có phải của user này không
        const [products] = await db.query(
            'SELECT * FROM products WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc bạn không có quyền sửa.' });
        }

        const { title, description, price, category_id, type, image_url, status } = req.body;

        await db.query(
            `UPDATE products
             SET title = ?, description = ?, price = ?, category_id = ?,
                 type = ?, image_url = ?, status = ?
             WHERE id = ? AND user_id = ?`,
            [
                title       || products[0].title,
                description !== undefined ? description : products[0].description,
                price       || products[0].price,
                category_id || products[0].category_id,
                type        || products[0].type,
                image_url   !== undefined ? image_url : products[0].image_url,
                status      || products[0].status,
                id, userId
            ]
        );

        res.json({ message: 'Cập nhật tin thành công!' });

    } catch (error) {
        console.error('Lỗi updateProduct:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật.' });
    }
};

// ============================================================
// XOÁ SẢN PHẨM (chỉ chủ tin mới được xoá)
// DELETE /api/products/:id
// ============================================================
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Kiểm tra quyền sở hữu
        const [products] = await db.query(
            'SELECT id FROM products WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc bạn không có quyền xoá.' });
        }

        await db.query('DELETE FROM products WHERE id = ?', [id]);

        res.json({ message: 'Xoá tin thành công!' });

    } catch (error) {
        console.error('Lỗi deleteProduct:', error);
        res.status(500).json({ message: 'Lỗi server khi xoá.' });
    }
};

// ============================================================
// LẤY TIN ĐĂNG CỦA 1 USER (Trang "Tin của tôi")
// GET /api/products/user/:userId
// ============================================================
const getProductsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const [products] = await db.query(`
            SELECT p.*, c.name AS category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `, [userId]);

        res.json(products);

    } catch (error) {
        console.error('Lỗi getProductsByUser:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByUser
};
