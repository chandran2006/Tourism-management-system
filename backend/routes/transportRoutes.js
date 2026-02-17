const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Calculate transport cost
router.post('/calculate', transportController.calculateTransport);

// Get all transport options
router.post('/options', transportController.getAllOptions);

// Get best transport based on budget
router.post('/best', transportController.getBestTransport);

// Get recommendations
router.post('/recommendations', transportController.getRecommendations);

// Estimate trip cost
router.post('/trip-cost', transportController.estimateTripCost);

// Calculate fuel cost
router.post('/fuel-cost', transportController.calculateFuelCost);

// Get distance
router.post('/distance', transportController.getDistance);

module.exports = router;
