const express = require('express');
const router = express.Router();
const tripPlannerController = require('../controllers/tripPlannerController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// CRUD operations
router.post('/', tripPlannerController.createTripPlan);
router.get('/', tripPlannerController.getUserTrips);
router.get('/:id', tripPlannerController.getTripDetails);
router.get('/:id/budget', tripPlannerController.getTripBudget);
router.patch('/:id/status', tripPlannerController.updateTripStatus);
router.delete('/:id', tripPlannerController.deleteTrip);

module.exports = router;
