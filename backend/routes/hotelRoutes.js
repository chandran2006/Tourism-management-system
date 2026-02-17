const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public routes (no auth required for browsing hotels)
router.get('/', hotelController.getHotels);
router.get('/search', hotelController.searchHotels);
router.get('/cities', hotelController.getCities);
router.get('/featured', hotelController.getFeaturedHotels);
router.get('/price-range', hotelController.getPriceRange);
router.get('/stats/:city', hotelController.getCityStats);
router.get('/city/:city', hotelController.getHotelsByCity);
router.get('/:id', hotelController.getHotelById);

// Protected routes (require authentication)
router.post('/recommendations', authenticate, hotelController.getRecommendations);

// Admin routes
router.post('/admin', authenticate, requireAdmin, hotelController.createHotel);
router.put('/admin/:id', authenticate, requireAdmin, hotelController.updateHotel);
router.delete('/admin/:id', authenticate, requireAdmin, hotelController.deleteHotel);

module.exports = router;
