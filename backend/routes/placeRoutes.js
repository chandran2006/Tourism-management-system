const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', placeController.getAllPlaces);
router.get('/recommendations', authMiddleware, placeController.getRecommendations);
router.get('/category/:category', placeController.getPlacesByCategory);
router.get('/:id', placeController.getPlaceById);
router.post('/', authMiddleware, adminMiddleware, placeController.createPlace);
router.put('/:id', authMiddleware, adminMiddleware, placeController.updatePlace);
router.delete('/:id', authMiddleware, adminMiddleware, placeController.deletePlace);
router.post('/itinerary', placeController.generateItinerary);
router.post('/timeline', placeController.generateTimeline);

module.exports = router;
