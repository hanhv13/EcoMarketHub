// FILE: backend/routes/productRoutes.js
const express = require('express');
const router  = express.Router();
const {
    getAllProducts, getProductById, createProduct,
    updateProduct, deleteProduct, getProductsByUser, getCategoriesWithCount
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.route('/')
    .get(getAllProducts)                 // GET /api/products
    .post(authMiddleware, createProduct); // POST /api/products

router.get('/categories-with-count', getCategoriesWithCount);

// GET /api/products/user/:userId
router.get('/user/:userId', getProductsByUser);

router.route('/:id')
    .get(getProductById)                    // GET /api/products/:id
    .put(authMiddleware, updateProduct)     // PUT /api/products/:id
    .delete(authMiddleware, deleteProduct); // DELETE /api/products/:id

module.exports = router;