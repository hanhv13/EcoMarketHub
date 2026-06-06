const db = require('../config/db');

// ============================================================
// GET PRODUCT LIST (with search + filter + pagination)
// ============================================================
const getAllProducts = async (req, res) => {
    try {
        const { search, category, type, location, excludeUserId, page = 1, limit = 12 } = req.query;

        let sql = `
            SELECT
                p.id, p.title, p.description, p.price, p.image_url,
                p.type, p.status, p.created_at, p.condition, p.location, p.is_premium, p.is_upcycled, p.stock_quantity, p.images,
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

        if (excludeUserId) {
            sql += ' AND p.user_id != ?';
            params.push(parseInt(excludeUserId));
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

        if (excludeUserId) {
            countSql += ' AND p.user_id != ?';
            countParams.push(parseInt(excludeUserId));
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
        const { title, description, price, category_id, type, image_url, condition, location, is_premium, is_upcycled, stock_quantity, images } = req.body;

        if (!title || !price || !category_id) {
            return res.status(400).json({ message: 'Please enter title, price, and category.' });
        }

        if (isNaN(price) || parseFloat(price) < 0) {
            return res.status(400).json({ message: 'Invalid price.' });
        }

        const userId = req.user.id;
        
        // Enforce: Used items (not upcycled) are unique, max stock 1.
        const isUpcycledBool = is_upcycled === true || is_upcycled === 'true' || is_upcycled === 1;
        const final_stock_quantity = !isUpcycledBool ? 1 : (stock_quantity || 1);

        const [result] = await db.query(
            `INSERT INTO products (user_id, category_id, title, description, price, image_url, type, \`condition\`, location, is_premium, is_upcycled, stock_quantity, images)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, category_id, title, description || '', price, image_url || null, type || 'sell',
                condition || 'Used', location || 'Vietnam', is_premium || false, isUpcycledBool, final_stock_quantity, images ? JSON.stringify(images) : null
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

        const { title, description, price, category_id, type, image_url, status, condition, location, is_premium, is_upcycled, stock_quantity, images } = req.body;

        const isUpcycledBool = is_upcycled !== undefined ? (is_upcycled === true || is_upcycled === 'true' || is_upcycled === 1) : products[0].is_upcycled;
        const final_stock_quantity = !isUpcycledBool ? 1 : (stock_quantity !== undefined ? stock_quantity : products[0].stock_quantity);

        await db.query(
            `UPDATE products
             SET title = ?, description = ?, price = ?, category_id = ?,
                 type = ?, image_url = ?, status = ?, \`condition\` = ?,
                 location = ?, is_premium = ?, is_upcycled = ?, stock_quantity = ?, images = ?
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
                isUpcycledBool, 
                final_stock_quantity,
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

// ============================================================
// CHECKOUT PRODUCTS
// Receives an array of items [{ id, quantity }]
// Checks stock, deducts stock, sets to 'sold' if 0, adds points.
// ============================================================
const checkoutProducts = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { items } = req.body; // array of { id, quantity }
        if (!items || items.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Cart is empty.' });
        }

        let totalUpcycledPoints = 0;

        for (const item of items) {
            const [rows] = await connection.query(
                'SELECT id, user_id AS seller_id, title, price, stock_quantity, is_upcycled FROM products WHERE id = ? FOR UPDATE',
                [item.id]
            );

            if (rows.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: `Product ID ${item.id} not found.` });
            }

            const product = rows[0];
            if (product.stock_quantity < item.quantity) {
                await connection.rollback();
                return res.status(400).json({ message: `Insufficient stock for product: ${product.title}. Only ${product.stock_quantity} left.` });
            }

            const newStock = product.stock_quantity - item.quantity;
            let statusQuery = newStock === 0 ? ", status = 'sold'" : "";

            await connection.query(
                `UPDATE products SET stock_quantity = ? ${statusQuery} WHERE id = ?`,
                [newStock, item.id]
            );

            await connection.query(
                'INSERT INTO purchases (buyer_id, seller_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
                [req.user.id, product.seller_id, item.id, item.quantity, product.price]
            );

            const isUpcycledBool = product.is_upcycled === true || product.is_upcycled === 'true' || product.is_upcycled === 1;
            if (isUpcycledBool) {
                const pointsEarned = Math.floor((parseFloat(product.price) * item.quantity) * 0.05);
                totalUpcycledPoints += pointsEarned;
            }
        }

        if (totalUpcycledPoints > 0) {
            await connection.query(
                'UPDATE users SET green_points = green_points + ? WHERE id = ?',
                [totalUpcycledPoints, req.user.id]
            );
        }

        await connection.commit();
        res.json({ message: 'Checkout successful!', earnedPoints: totalUpcycledPoints });

    } catch (error) {
        await connection.rollback();
        console.error('checkoutProducts error:', error);
        res.status(500).json({ message: 'Server error during checkout.' });
    } finally {
        connection.release();
    }
};

// ============================================================
// GET PURCHASED ITEMS
// ============================================================
const getPurchasedItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const [purchases] = await db.query(`
            SELECT p.id as purchase_id, p.quantity as purchase_quantity, p.price as purchase_price, p.created_at as purchase_date,
                   pr.id as product_id, pr.title, pr.image_url, pr.category_id, pr.type,
                   c.name AS category_name,
                   u.id AS seller_id, u.username AS seller_name
            FROM purchases p
            JOIN products pr ON p.product_id = pr.id
            JOIN users u ON p.seller_id = u.id
            JOIN categories c ON pr.category_id = c.id
            WHERE p.buyer_id = ?
            ORDER BY p.created_at DESC
        `, [userId]);

        res.json(purchases);
    } catch (error) {
        console.error('getPurchasedItems error:', error);
        res.status(500).json({ message: 'Server error while fetching purchased items.' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByUser,
    getCategoriesWithCount,
    checkoutProducts,
    getPurchasedItems
};
