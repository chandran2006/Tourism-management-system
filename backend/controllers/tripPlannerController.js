const tripPlannerService = require('../services/tripPlannerService');

/**
 * Create a new trip plan
 * POST /api/trips
 */
exports.createTripPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const tripData = req.body;

    // Validate required fields
    const required = ['tripName', 'destination', 'startDate', 'endDate', 'plannedBudget'];
    const missing = required.filter(field => !tripData[field]);

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      });
    }

    // Validate dates
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Validate budget
    if (tripData.plannedBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be greater than 0'
      });
    }

    const tripPlan = await tripPlannerService.createTripPlan(tripData, userId);

    res.status(201).json({
      success: true,
      message: 'Trip plan created successfully',
      data: tripPlan
    });

  } catch (error) {
    console.error('Create Trip Plan Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create trip plan'
    });
  }
};

/**
 * Get trip details
 * GET /api/trips/:id
 */
exports.getTripDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await tripPlannerService.getTripDetails(id, userId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      data: trip
    });

  } catch (error) {
    console.error('Get Trip Details Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve trip details'
    });
  }
};

/**
 * Get trip budget breakdown
 * GET /api/trips/:id/budget
 */
exports.getTripBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await tripPlannerService.getTripBudget(id, userId);

    res.json({
      success: true,
      data: budget
    });

  } catch (error) {
    console.error('Get Trip Budget Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve trip budget'
    });
  }
};

/**
 * Update trip status
 * PATCH /api/trips/:id/status
 */
exports.updateTripStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    await tripPlannerService.updateTripStatus(id, userId, status);

    res.json({
      success: true,
      message: 'Trip status updated successfully'
    });

  } catch (error) {
    console.error('Update Trip Status Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all trips for user
 * GET /api/trips
 */
exports.getUserTrips = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const trips = await tripPlannerService.getUserTrips(userId, status);

    res.json({
      success: true,
      data: trips
    });

  } catch (error) {
    console.error('Get User Trips Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve trips'
    });
  }
};

/**
 * Delete a trip
 * DELETE /api/trips/:id
 */
exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await tripPlannerService.deleteTrip(id, userId);

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    console.error('Delete Trip Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trip'
    });
  }
};
