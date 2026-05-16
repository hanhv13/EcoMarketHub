const db = require('../config/db');

// ============================================================
// GET PRODUCT LIST (with search + filter + pagination)
// ============================================================
const getAllProducts = async (req, res) => {
    try {
        const { search, category, type, location, page = 1, limit = 12 } = req.query;

        let sql = `
            SELECT
                p.id, p.title, p.description, p.price, p.image_url,
                p.type, p.status, p.created_at, p.condition, p.location, p.is_premium, p.images,
                u.id AS seller_id, u.username AS seller_name, u.avatar_url AS seller_avatar,
                c.id AS category_id, c.name AS category_name
            FROM products p
            JOIN users u ON p.user_id = u.id
            JOIN categories c ON p.category_id = c.id
            WHERE p.status = 'active'
        `;

        const params = [];

        if (search) {
            sql += ' AND (p.title LIKE ? OR p.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (category) {
            sql += ' AND p.category_id = ?';
            params.push(parseInt(category));
        }

        if (type && ['sell', 'rent'].includes(type)) {
            sql += ' AND p.type = ?';
            params.push(type);
        }

        if (location) {
            sql += ' AND p.location = ?';
            params.push(location);
        }

        if (req.query.sortPrice === 'asc') {
            sql += ' ORDER BY p.price ASC, p.created_at DESC';
        } else if (req.query.sortPrice === 'desc') {
            sql += ' ORDER BY p.price DESC, p.created_at DESC';
        } else {
            sql += ' ORDER BY p.created_at DESC';
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [products] = await db.query(sql, params);

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
        if (location) {
            countSql += ' AND p.location = ?';
            countParams.push(location);
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
        console.error('getAllProducts error:', error);
        res.status(500).json({ message: 'Server error while fetching products.' });
    }
};

// ============================================================
// GET PRODUCT BY ID
// ============================================================
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

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
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json(products[0]);

    } catch (error) {
        console.error('getProductById error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// ============================================================
// CREATE NEW PRODUCT
// ============================================================
const createProduct = async (req, res) => {
    try {
        const { title, description, price, category_id, type, image_url, condition, location, is_premium, images } = req.body;

        if (!title || !price || !category_id) {
            return res.status(400).json({ message: 'Please enter title, price, and category.' });
        }

        if (isNaN(price) || parseFloat(price) < 0) {
            return res.status(400).json({ message: 'Invalid price.' });
        }

        const userId = req.user.id;

        const [result] = await db.query(
            `INSERT INTO products (user_id, category_id, title, description, price, image_url, type, \`condition\`, location, is_premium, images)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, category_id, title, description || '', price, image_url || null, type || 'sell',
                condition || 'Used', location || 'Vietnam', is_premium || false, images ? JSON.stringify(images) : null
            ]
        );

        const [newProduct] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            message: 'Product posted successfully!',
            product: newProduct[0]
        });

    } catch (error) {
        console.error('createProduct error:', error);
        res.status(500).json({ message: 'Server error while creating product.' });
    }
};

// ============================================================
// UPDATE PRODUCT
// ============================================================
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [products] = await db.query(
            'SELECT * FROM products WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found or access denied.' });
        }

        const { title, description, price, category_id, type, image_url, status, condition, location, is_premium, images } = req.body;

        await db.query(
            `UPDATE products
             SET title = ?, description = ?, price = ?, category_id = ?,
                 type = ?, image_url = ?, status = ?, \`condition\` = ?,
                 location = ?, is_premium = ?, images = ?
             WHERE id = ? AND user_id = ?`,
            [
                title       || products[0].title,
                description !== undefined ? description : products[0].description,
                price       || products[0].price,
                category_id || products[0].category_id,
                type        || products[0].type,
                image_url   !== undefined ? image_url : products[0].image_url,
                status      || products[0].status,
                condition   || products[0].condition,
                location    || products[0].location,
                is_premium  !== undefined ? is_premium : products[0].is_premium,
                images      ? JSON.stringify(images) : products[0].images,
                id, userId
            ]
        );

        res.json({ message: 'Product updated successfully!' });

    } catch (error) {
        console.error('updateProduct error:', error);
        res.status(500).json({ message: 'Server error while updating.' });
    }
};

// ============================================================
// DELETE PRODUCT
// ============================================================
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [products] = await db.query(
            'SELECT id FROM products WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found or access denied.' });
        }

        await db.query('DELETE FROM products WHERE id = ?', [id]);

        res.json({ message: 'Product deleted successfully!' });

    } catch (error) {
        console.error('deleteProduct error:', error);
        res.status(500).json({ message: 'Server error while deleting.' });
    }
};

// ============================================================
// GET PRODUCTS BY USER
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
        console.error('getProductsByUser error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


// ============================================================
// GET CATEGORIES WITH PRODUCT COUNT
// Returns each category with how many active products it has
// ============================================================
const getCategoriesWithCount = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                c.id,
                c.name,
                COUNT(p.id) AS product_count
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id AND p.status = 'active'
            GROUP BY c.id, c.name
            ORDER BY
                CASE WHEN LOWER(c.name) LIKE '%other%' THEN 1 ELSE 0 END ASC,
                c.id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error('getCategoriesWithCount error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByUser,
    getCategoriesWithCount
};
