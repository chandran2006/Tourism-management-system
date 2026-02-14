const express = require('express');
const router = express.Router();
const enhancedController = require('../controllers/enhancedController');
const { authenticateToken } = require('../middleware/auth');

router.get('/trending', enhancedController.getTrendingPlaces);
router.get('/nearby', enhancedController.getNearbyPlaces);
router.get('/weather', enhancedController.getWeather);
router.post('/budget', enhancedController.calculateBudget);
router.post('/plans', authenticateToken, enhancedController.saveTravelPlan);
router.get('/plans', authenticateToken, enhancedController.getSavedPlans);
router.delete('/plans/:id', authenticateToken, enhancedController.deleteSavedPlan);

module.exports = router;
