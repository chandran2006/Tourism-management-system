const transportService = require('../services/transportService');

/**
 * Calculate transport cost between two locations
 * POST /api/transport/calculate
 */
exports.calculateTransport = async (req, res) => {
  try {
    const { from, to, mode } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'From and to locations are required'
      });
    }

    const distance = transportService.calculateDistance(from, to);
    const cost = mode ? transportService.calculateCost(mode, distance) : null;
    const time = mode ? transportService.calculateTravelTime(mode, distance) : null;

    res.json({
      success: true,
      data: {
        from,
        to,
        distance,
        mode,
        cost,
        time: time?.formatted,
        timeMinutes: time?.minutes
      }
    });

  } catch (error) {
    console.error('Calculate Transport Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all transport options
 * POST /api/transport/options
 */
exports.getAllOptions = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'From and to locations are required'
      });
    }

    const options = transportService.getAllOptions(from, to);

    res.json({
      success: true,
      data: {
        from,
        to,
        options,
        count: options.length
      }
    });

  } catch (error) {
    console.error('Get Transport Options Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get transport options'
    });
  }
};

/**
 * Get best transport based on budget
 * POST /api/transport/best
 */
exports.getBestTransport = async (req, res) => {
  try {
    const { from, to, budget } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'From and to locations are required'
      });
    }

    const best = transportService.getBestTransport(from, to, budget);

    res.json({
      success: true,
      data: best
    });

  } catch (error) {
    console.error('Get Best Transport Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get best transport option'
    });
  }
};

/**
 * Get transport recommendations
 * POST /api/transport/recommendations
 */
exports.getRecommendations = async (req, res) => {
  try {
    const { from, to, budget, priority } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'From and to locations are required'
      });
    }

    const recommendations = transportService.getRecommendations(from, to, { budget, priority });

    res.json({
      success: true,
      data: recommendations
    });

  } catch (error) {
    console.error('Get Recommendations Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
};

/**
 * Estimate trip cost with multiple destinations
 * POST /api/transport/trip-cost
 */
exports.estimateTripCost = async (req, res) => {
  try {
    const { itinerary, mode = 'cab' } = req.body;

    if (!itinerary || !Array.isArray(itinerary) || itinerary.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Itinerary must be an array with at least 2 destinations'
      });
    }

    const estimate = transportService.estimateTripCost(itinerary, mode);

    res.json({
      success: true,
      data: estimate
    });

  } catch (error) {
    console.error('Estimate Trip Cost Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Calculate fuel cost for personal vehicle
 * POST /api/transport/fuel-cost
 */
exports.calculateFuelCost = async (req, res) => {
  try {
    const { distance, mileage = 15, fuelPrice = 100 } = req.body;

    if (!distance || distance <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid distance is required'
      });
    }

    const fuelCost = transportService.calculateFuelCost(distance, mileage, fuelPrice);

    res.json({
      success: true,
      data: fuelCost
    });

  } catch (error) {
    console.error('Calculate Fuel Cost Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate fuel cost'
    });
  }
};

/**
 * Get distance between two locations
 * POST /api/transport/distance
 */
exports.getDistance = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'From and to locations are required'
      });
    }

    const distance = transportService.calculateDistance(from, to);

    res.json({
      success: true,
      data: {
        from,
        to,
        distance,
        unit: 'km'
      }
    });

  } catch (error) {
    console.error('Get Distance Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate distance'
    });
  }
};
