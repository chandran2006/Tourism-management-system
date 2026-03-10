const express = require('express');
const router = express.Router();
const enhancedController = require('../controllers/enhancedController');
const { authMiddleware } = require('../middleware/auth');

router.get('/trending', enhancedController.getTrendingPlaces);
router.get('/nearby', enhancedController.getNearbyPlaces);
router.get('/weather', enhancedController.getWeather);
router.post('/budget', enhancedController.calculateBudget);
router.post('/plans', authMiddleware, enhancedController.saveTravelPlan);
router.get('/plans', authMiddleware, enhancedController.getSavedPlans);
router.delete('/plans/:id', authMiddleware, enhancedController.deleteSavedPlan);

module.exports = router;
