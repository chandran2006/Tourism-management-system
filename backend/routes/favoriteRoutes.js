const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, favoriteController.addFavorite);
router.get('/', authMiddleware, favoriteController.getFavorites);
router.delete('/:placeId', authMiddleware, favoriteController.removeFavorite);

module.exports = router;
