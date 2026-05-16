const express = require('express');
const router  = express.Router();
const { getFavorites, addFavorite, removeFavorite, checkFavorite } = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',                       authMiddleware, getFavorites);  
router.get('/check/:productId',       authMiddleware, checkFavorite); 
router.post('/:productId',            authMiddleware, addFavorite);    
router.delete('/:productId',          authMiddleware, removeFavorite);

module.exports = router;