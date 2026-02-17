const hotelService = require('../services/hotelService');

/**
 * Get all hotels with optional filters
 * GET /api/hotels
 */
exports.getHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, minRating, sortBy, search, page = 1, limit = 20 } = req.query;

    const filters = {
      city,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      sortBy,
      search
    };

    const hotels = await hotelService.getHotels(filters);

    // Implement pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedHotels = hotels.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        hotels: paginatedHotels,
        pagination: {
          total: hotels.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(hotels.length / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get Hotels Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hotels'
    });
  }
};

/**
 * Get hotel by ID
 * GET /api/hotels/:id
 */
exports.getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await hotelService.getHotelById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: hotel
    });

  } catch (error) {
    console.error('Get Hotel Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hotel'
    });
  }
};

/**
 * Get hotels by city
 * GET /api/hotels/city/:city
 */
exports.getHotelsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { minPrice, maxPrice, minRating, sortBy } = req.query;

    const options = {
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      sortBy
    };

    const hotels = await hotelService.getHotelsByCity(city, options);

    res.json({
      success: true,
      data: {
        city,
        hotels,
        count: hotels.length
      }
    });

  } catch (error) {
    console.error('Get Hotels By City Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hotels'
    });
  }
};

/**
 * Search hotels
 * GET /api/hotels/search
 */
exports.searchHotels = async (req, res) => {
  try {
    const { q, city, minPrice, maxPrice, minRating } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const filters = {
      city,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined
    };

    const hotels = await hotelService.searchHotels(q, filters);

    res.json({
      success: true,
      data: {
        query: q,
        hotels,
        count: hotels.length
      }
    });

  } catch (error) {
    console.error('Search Hotels Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search hotels'
    });
  }
};

/**
 * Get all cities with hotels
 * GET /api/hotels/cities
 */
exports.getCities = async (req, res) => {
  try {
    const cities = await hotelService.getCities();

    res.json({
      success: true,
      data: cities
    });

  } catch (error) {
    console.error('Get Cities Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cities'
    });
  }
};

/**
 * Get statistics for a city
 * GET /api/hotels/stats/:city
 */
exports.getCityStats = async (req, res) => {
  try {
    const { city } = req.params;

    const stats = await hotelService.getCityStats(city);

    res.json({
      success: true,
      data: {
        city,
        ...stats
      }
    });

  } catch (error) {
    console.error('Get City Stats Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics'
    });
  }
};

/**
 * Get featured hotels
 * GET /api/hotels/featured
 */
exports.getFeaturedHotels = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const hotels = await hotelService.getFeaturedHotels(parseInt(limit));

    res.json({
      success: true,
      data: hotels
    });

  } catch (error) {
    console.error('Get Featured Hotels Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured hotels'
    });
  }
};

/**
 * Get hotel recommendations based on budget
 * POST /api/hotels/recommendations
 */
exports.getRecommendations = async (req, res) => {
  try {
    const { city, budget, rating = 3.0 } = req.body;

    if (!city || !budget) {
      return res.status(400).json({
        success: false,
        message: 'City and budget are required'
      });
    }

    const hotels = await hotelService.getRecommendations(city, budget, rating);

    res.json({
      success: true,
      data: {
        city,
        budget,
        minRating: rating,
        hotels,
        count: hotels.length
      }
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
 * Get price range
 * GET /api/hotels/price-range
 */
exports.getPriceRange = async (req, res) => {
  try {
    const { city } = req.query;

    const priceRange = await hotelService.getPriceRange(city);

    res.json({
      success: true,
      data: priceRange
    });

  } catch (error) {
    console.error('Get Price Range Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve price range'
    });
  }
};

/**
 * Create a new hotel (Admin only)
 * POST /api/hotels/admin
 */
exports.createHotel = async (req, res) => {
  try {
    const hotelData = req.body;

    // Validate required fields
    const required = ['name', 'city', 'pricePerNight', 'rating'];
    const missing = required.filter(field => !hotelData[field]);

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      });
    }

    const hotel = await hotelService.createHotel(hotelData);

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel
    });

  } catch (error) {
    console.error('Create Hotel Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create hotel'
    });
  }
};

/**
 * Update hotel (Admin only)
 * PUT /api/hotels/admin/:id
 */
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const hotel = await hotelService.updateHotel(id, updateData);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel
    });

  } catch (error) {
    console.error('Update Hotel Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update hotel'
    });
  }
};

/**
 * Delete hotel (Admin only)
 * DELETE /api/hotels/admin/:id
 */
exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    await hotelService.deleteHotel(id);

    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });

  } catch (error) {
    console.error('Delete Hotel Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hotel'
    });
  }
};
